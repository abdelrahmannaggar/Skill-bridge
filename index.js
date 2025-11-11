require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

// Create MySQL connection config with hardcoded values
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'skill-bridge'
};

// Test database connection
const testConnection = () => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            console.error('Database connection error:', err.message);
            process.exit(1);
        }
        console.log('Successfully connected to the database.');
        connection.end();
    });
};

// Test connection on startup
testConnection();

// Create contact_messages table if it doesn't exist
const createContactMessagesTable = `
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const contactDbConnection = mysql.createConnection(dbConfig);
contactDbConnection.query(createContactMessagesTable, (err) => {
    if (err) {
        console.error('Error creating contact_messages table:', err);
    } else {
        console.log('Contact messages table checked/created successfully');
    }
    contactDbConnection.end();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs and Word documents are allowed.'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Health check route
app.get('/api/health', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect(function(err) {
    if (err) {
      res.json({ status: 'ok', db: 'disconnected', message: 'Backend is running, but DB is not connected.' });
    } else {
      res.json({ status: 'ok', db: 'connected', message: 'Backend and DB are running!' });
    }
    connection.end();
  });
});

// User Registration
app.post('/api/register', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
]), async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    try {
        // Accept both fullName and full_name
        const fullName = req.body.full_name || req.body.fullName;
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone || null;
        const location = req.body.location || null;
        const occupation = req.body.occupation || null;
        const bio = req.body.bio || null;
        const role = req.body.role || 'user';
        const expertise = req.body.expertise || null;
        const teaching_experience = req.body.teaching_experience || null;
        
        // Handle skills data
        let skills = [];
        if (req.body.skills) {
            try {
                skills = typeof req.body.skills === 'string' ? 
                    JSON.parse(req.body.skills) : req.body.skills;
            } catch (e) {
                console.error('Error parsing skills:', e);
                skills = [];
            }
        }

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Full name, email and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if email already exists
        const [existingUsers] = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err, results) => {
                    if (err) reject(err);
                    else resolve([results]);
                }
            );
        });

        if (existingUsers.length > 0) {
            connection.end();
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle file uploads
        let resumeUrl = null;
        let avatarUrl = null;
        if (req.files) {
            if (req.files.resume) {
                resumeUrl = `/uploads/${req.files.resume[0].filename}`;
            }
            if (req.files.avatar) {
                avatarUrl = `/uploads/${req.files.avatar[0].filename}`;
            }
        }

        // Generate username from email
        const username = email.split('@')[0];

        // Insert user with verified_skills and instructor-specific fields
        const registerQuery = `
            INSERT INTO users (
                username, 
                email, 
                password, 
                full_name, 
                phone, 
                location, 
                resume, 
                bio, 
                avatar, 
                verified_skills, 
                role, 
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const [userResult] = await new Promise((resolve, reject) => {
            connection.query(
                registerQuery,
                [username, email, hashedPassword, fullName, phone, location, resumeUrl, bio, avatarUrl, JSON.stringify(skills), role],
                (err, result) => {
                    if (err) reject(err);
                    else resolve([result]);
                }
            );
        });

        const userId = userResult.insertId;

        // Create JWT token
        const token = jwt.sign(
            { id: userId, username, email, role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Close database connection
        connection.end();

        // Send success response
        res.status(201).json({
            message: 'User registered successfully',
            userId,
            token,
            user: {
                id: userId,
                username,
                email,
                full_name: fullName,
                phone,
                location,
                bio,
                avatar: avatarUrl,
                resume: resumeUrl,
                skills: skills,
                role,
                expertise,
                teaching_experience
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        connection.end();
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const connection = mysql.createConnection(dbConfig);
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        connection.end();
        return res.status(500).json({ error: 'Database error.' });
      }
      if (results.length === 0) {
        connection.end();
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        connection.end();
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      // Check if user is instructor
      connection.query(
        'SELECT 1 FROM instructor_users WHERE user_id = ? LIMIT 1',
        [user.id],
        (err, instructorResults) => {
          connection.end();
          const is_instructor = instructorResults && instructorResults.length > 0;
          // Create JWT token
          const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '2h' }
          );
          res.json({
            message: 'Login successful.',
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              full_name: user.full_name,
              phone: user.phone,
              location: user.location,
              bio: user.bio,
              avatar: user.avatar,
              resume: user.resume,
              role: user.role,
              expertise: user.expertise,
              teaching_experience: user.teaching_experience,
              is_instructor
            }
          });
        }
      );
    }
  );
});

// JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token);
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided.' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid token.' });
    }
    console.log('Token verified successfully, user:', user);
    req.user = user;
    next();
  });
}

// Example protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.query(
    'SELECT id, username, email, full_name, phone, location, occupation, bio, avatar, resume, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (results.length === 0) return res.status(404).json({ error: 'User not found.' });
      
      const user = results[0];
      res.json({
        message: 'Profile data retrieved successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          location: user.location,
          occupation: user.occupation,
          bio: user.bio,
          avatar: user.avatar,
          resume: user.resume,
          member_since: new Date(user.created_at).toLocaleDateString()
        }
      });
    }
  );
});

// Profile Update Endpoint
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { fullName, email, location, occupation, bio, avatar } = req.body;
  const userId = req.user.id;
  
  console.log('Received update request:', { fullName, email, location, occupation, bio, avatar, userId }); // Debug log
  console.log('Request body:', req.body); // Debug log
  
  const connection = mysql.createConnection(dbConfig);
  connection.query(
    'UPDATE users SET full_name=?, email=?, location=?, occupation=?, bio=?, avatar=? WHERE id=?',
    [fullName || '', email || '', location || '', occupation || '', bio || '', avatar || '', userId],
    (err, result) => {
      if (err) {
        console.error('Database update error:', err); // Debug log
        connection.end();
        return res.status(500).json({ error: 'Database error.' });
      }
      console.log('Update result:', result); // Debug log
      
      // Fetch updated user
      connection.query(
        'SELECT id, username, email, full_name, location, occupation, bio, avatar, resume, created_at as member_since FROM users WHERE id=?',
        [userId],
        (err, results) => {
          connection.end();
          if (err || results.length === 0) {
            console.error('Database fetch error:', err); // Debug log
            return res.status(500).json({ error: 'Database error.' });
          }
          console.log('Updated user data:', results[0]); // Debug log
          res.json(results[0]);
        }
      );
    }
  );
});

// ===== Feedback Endpoints =====

// GET all feedbacks (with user info)
app.get('/api/feedbacks', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = `SELECT f.id, f.message, f.created_at, u.username, u.avatar
               FROM feedback f
               LEFT JOIN users u ON f.user_id = u.id
               ORDER BY f.created_at DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
});

// POST new feedback (protected)
app.post('/api/feedbacks', authenticateToken, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });
  const userId = req.user.id;
  const connection = mysql.createConnection(dbConfig);
  connection.query(
    'INSERT INTO feedback (user_id, message) VALUES (?, ?)',
    [userId, message],
    (err, result) => {
      connection.end();
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.status(201).json({ message: 'Feedback submitted.' });
    }
  );
});

// ===== Skills Endpoints =====
app.get('/api/skills', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = 'SELECT * FROM skills ORDER BY name';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
});

// ===== Courses Endpoints =====
app.get('/api/courses', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = `SELECT c.*, u.username as instructor_name 
               FROM courses c 
               LEFT JOIN users u ON c.instructor_id = u.id 
               ORDER BY c.created_at DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
});

// ===== Events Endpoints =====
app.get('/api/events', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = 'SELECT * FROM events ORDER BY event_date ASC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
});

// Get single event details
app.get('/api/events/:id', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = 'SELECT * FROM events WHERE id = ?';
  connection.query(sql, [req.params.id], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ error: 'Event not found.' });
    res.json(results[0]);
  });
});

// Create events table if it doesn't exist
const createEventsTable = `
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255),
    capacity INT,
    category VARCHAR(100),
    organizer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Create event_registrations table if it doesn't exist
const createEventRegistrationsTable = `
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date DATETIME NOT NULL,
    status ENUM('registered', 'cancelled') DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (user_id, event_id)
)`;

// Execute table creation
const connection = mysql.createConnection(dbConfig);
connection.query(createEventsTable, (err) => {
    if (err) {
        console.error('Error creating events table:', err);
    } else {
        console.log('Events table checked/created successfully');
        
        // Create event_registrations table after events table
        connection.query(createEventRegistrationsTable, (err) => {
            if (err) {
                console.error('Error creating event_registrations table:', err);
            } else {
                console.log('Event registrations table checked/created successfully');
            }
            connection.end();
        });
    }
});

// Insert some sample events if the table is empty
const insertSampleEvents = `
INSERT INTO events (title, description, date, time, location, capacity, category, organizer)
SELECT * FROM (
    SELECT 
        'Web Development Bootcamp' as title,
        'Learn modern web development technologies and best practices.' as description,
        DATE_ADD(CURDATE(), INTERVAL 7 DAY) as date,
        '10:00:00' as time,
        'Online' as location,
        50 as capacity,
        'Technology' as category,
        'Skill Bridge Team' as organizer
    UNION ALL
    SELECT 
        'Data Science Workshop' as title,
        'Introduction to data analysis, machine learning, and visualization techniques.' as description,
        DATE_ADD(CURDATE(), INTERVAL 14 DAY) as date,
        '14:00:00' as time,
        'Tech Hub, Downtown' as location,
        30 as capacity,
        'Data Science' as category,
        'Data Analytics Institute' as organizer
    UNION ALL
    SELECT 
        'Digital Marketing Masterclass' as title,
        'Master SEO, social media marketing, and content strategy.' as description,
        DATE_ADD(CURDATE(), INTERVAL 21 DAY) as date,
        '09:30:00' as time,
        'Business Center' as location,
        40 as capacity,
        'Marketing' as category,
        'Digital Marketing Pro' as organizer
    UNION ALL
    SELECT 
        'UI/UX Design Workshop' as title,
        'Learn user interface and experience design principles and tools.' as description,
        DATE_ADD(CURDATE(), INTERVAL 28 DAY) as date,
        '11:00:00' as time,
        'Design Studio' as location,
        25 as capacity,
        'Design' as category,
        'Creative Design Academy' as organizer
    UNION ALL
    SELECT 
        'Mobile App Development' as title,
        'Build iOS and Android apps using React Native and Flutter.' as description,
        DATE_ADD(CURDATE(), INTERVAL 35 DAY) as date,
        '13:00:00' as time,
        'Online' as location,
        45 as capacity,
        'Mobile Development' as category,
        'App Development Experts' as organizer
    UNION ALL
    SELECT 
        'Cloud Computing Workshop' as title,
        'Introduction to AWS, Azure, and Google Cloud Platform.' as description,
        DATE_ADD(CURDATE(), INTERVAL 42 DAY) as date,
        '15:30:00' as time,
        'Tech Conference Center' as location,
        35 as capacity,
        'Cloud Computing' as category,
        'Cloud Solutions Inc.' as organizer
    UNION ALL
    SELECT 
        'Cybersecurity Training' as title,
        'Learn about network security, ethical hacking, and security best practices.' as description,
        DATE_ADD(CURDATE(), INTERVAL 49 DAY) as date,
        '10:00:00' as time,
        'Security Training Center' as location,
        30 as capacity,
        'Security' as category,
        'Cyber Security Institute' as organizer
    UNION ALL
    SELECT 
        'Blockchain Development' as title,
        'Introduction to blockchain technology and smart contract development.' as description,
        DATE_ADD(CURDATE(), INTERVAL 56 DAY) as date,
        '14:00:00' as time,
        'Online' as location,
        40 as capacity,
        'Blockchain' as category,
        'Blockchain Academy' as organizer
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM events LIMIT 1
)`;

connection.query(insertSampleEvents, (err) => {
    if (err) {
        console.error('Error inserting sample events:', err);
    } else {
        console.log('Sample events checked/inserted successfully');
    }
});

// Join event
app.post('/api/events/:id/join', authenticateToken, async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const userId = req.user.id;
  const eventId = req.params.id;

  try {
    // First check if the event exists
    const [eventResults] = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });

    if (eventResults.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = eventResults[0];

    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      connection.end();
      return res.status(400).json({ error: 'Cannot join past events.' });
    }

    // Check if user is already registered for the event
    const [registrationResults] = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?',
        [userId, eventId],
        (err, results) => {
          if (err) reject(err);
          else resolve([results]);
        }
      );
    });

    if (registrationResults.length > 0) {
      connection.end();
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    // Check if event is at capacity
    if (event.capacity) {
      const [capacityResults] = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?',
          [eventId],
          (err, results) => {
            if (err) reject(err);
            else resolve([results]);
          }
        );
      });

      if (capacityResults[0].count >= event.capacity) {
        connection.end();
        return res.status(400).json({ error: 'Sorry, this event is at full capacity.' });
      }
    }

    // Register user for the event
    const [result] = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO event_registrations (user_id, event_id, registration_date) VALUES (?, ?, NOW())',
        [userId, eventId],
        (err, result) => {
          if (err) reject(err);
          else resolve([result]);
        }
      );
    });

    connection.end();
    res.json({ 
      message: 'Successfully joined the event!',
      registration_id: result.insertId
    });

  } catch (error) {
    console.error('Error in join event process:', error);
    connection.end();
    res.status(500).json({ 
      error: 'Failed to register for event. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // Return the full URL for the uploaded file
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ 
    message: 'File uploaded successfully.',
    fileUrl: fileUrl
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Users Endpoint =====
app.get('/api/users', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  // This query gets users and their skills as a comma-separated string
  const sql = `
    SELECT 
      u.id, u.username, u.full_name, u.bio, u.avatar,
      GROUP_CONCAT(s.name) AS skills
    FROM users u
    LEFT JOIN user_skills us ON u.id = us.user_id
    LEFT JOIN skills s ON us.skill_id = s.id
    GROUP BY u.id
  `;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    // Convert skills string to array for each user
    const users = results.map(u => ({
      ...u,
      skills: u.skills ? u.skills.split(',') : []
    }));
    res.json(users);
  });
});

// ===== Chat Messages Endpoints =====
// GET /api/messages?user=<id> - fetch all messages between logged-in user and another user
app.get('/api/messages', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.query.user);
  if (!otherUserId) return res.status(400).json({ error: 'Missing user parameter.' });
  const connection = mysql.createConnection(dbConfig);
  const sql = `
    SELECT m.*, u.username, u.avatar
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.sent_at ASC
  `;
  connection.query(sql, [userId, otherUserId, otherUserId, userId], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    // Mark messages sent by the logged-in user
    const messages = results.map(msg => ({
      id: msg.id,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      content: msg.content,
      sent_at: msg.sent_at,
      sent_by_me: msg.sender_id === userId,
      username: msg.username,
      avatar: msg.avatar
    }));
    res.json(messages);
  });
});

// POST /api/messages - send a new message
app.post('/api/messages', authenticateToken, (req, res) => {
  const senderId = req.user.id;
  const { receiver_id, content } = req.body;
  if (!receiver_id || !content) return res.status(400).json({ error: 'Missing receiver_id or content.' });
  const connection = mysql.createConnection(dbConfig);
  const sql = 'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
  connection.query(sql, [senderId, receiver_id, content], (err, result) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.status(201).json({ message: 'Message sent.' });
  });
});

// ===== Tutorials Endpoints =====
app.get('/api/tutorials', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const searchQuery = req.query.search || '';
  const levelFilter = req.query.level || '';
  
  let sql = `
    SELECT t.*, u.username as instructor_name,
           COUNT(e.id) as enrollment_count
    FROM tutorials t 
    LEFT JOIN users u ON t.created_by = u.id 
    LEFT JOIN enrollments e ON t.id = e.tutorial_id
    WHERE 1=1
  `;
  const params = [];
  
  if (searchQuery) {
    sql += ` AND (t.title LIKE ? OR t.category LIKE ? OR t.description LIKE ?)`;
    params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
  }
  
  if (levelFilter) {
    sql += ` AND t.level = ?`;
    params.push(levelFilter);
  }
  
  sql += ` GROUP BY t.id ORDER BY t.created_at DESC`;
  
  connection.query(sql, params, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.json(results);
  });
});

app.get('/api/tutorials/:id', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const userId = req.user ? req.user.id : null;
  const tutorialId = parseInt(req.params.id);
  
  console.log('Fetching tutorial details:', { tutorialId, userId });
  
  if (isNaN(tutorialId)) {
    console.error('Invalid tutorial ID:', req.params.id);
    connection.end();
    return res.status(400).json({ error: 'Invalid tutorial ID.' });
  }
  
  const sql = `
    SELECT t.*, u.username as instructor_name,
           EXISTS(SELECT 1 FROM enrollments e 
                  WHERE e.tutorial_id = t.id 
                  AND e.user_id = ?) as is_enrolled,
           COUNT(e2.id) as students
    FROM tutorials t 
    LEFT JOIN users u ON t.created_by = u.id 
    LEFT JOIN enrollments e2 ON t.id = e2.tutorial_id
    WHERE t.id = ?
    GROUP BY t.id
  `;
  
  connection.query(sql, [userId, tutorialId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      connection.end();
      return res.status(500).json({ error: 'Database error.' });
    }
    
    if (results.length === 0) {
      console.log('No tutorial found with ID:', tutorialId);
      connection.end();
      return res.status(404).json({ error: 'Tutorial not found.' });
    }
    
    console.log('Tutorial details retrieved:', results[0]);
    connection.end();
    res.json(results[0]);
  });
});

app.post('/api/tutorials', authenticateToken, (req, res) => {
  const { title, instructor, level, category, description, duration, rating, students, image, price } = req.body;
  if (!title || !instructor || !level || !category) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }
  
  const connection = mysql.createConnection(dbConfig);
  const sql = `
    INSERT INTO tutorials (
      title, instructor, level, category, description, 
      duration, rating, students, image, price, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(
    sql,
    [title, instructor, level, category, description, duration, rating, students, image, price, req.user.id],
    (err, result) => {
      connection.end();
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.status(201).json({ id: result.insertId, message: 'Tutorial created successfully.' });
    }
  );
});

app.put('/api/tutorials/:id', authenticateToken, (req, res) => {
  const { title, instructor, level, category, description, duration, rating, students, image, price } = req.body;
  if (!title || !instructor || !level || !category) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }
  
  const connection = mysql.createConnection(dbConfig);
  const sql = `
    UPDATE tutorials 
    SET title = ?, instructor = ?, level = ?, category = ?, 
        description = ?, duration = ?, rating = ?, students = ?, 
        image = ?, price = ?
    WHERE id = ? AND created_by = ?
  `;
  
  connection.query(
    sql,
    [title, instructor, level, category, description, duration, rating, students, image, price, req.params.id, req.user.id],
    (err, result) => {
      connection.end();
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Tutorial not found or unauthorized.' });
      }
      res.json({ message: 'Tutorial updated successfully.' });
    }
  );
});

app.delete('/api/tutorials/:id', authenticateToken, (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = 'DELETE FROM tutorials WHERE id = ? AND created_by = ?';
  
  connection.query(sql, [req.params.id, req.user.id], (err, result) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tutorial not found or unauthorized.' });
    }
    res.json({ message: 'Tutorial deleted successfully.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/api/tutorials/:id/enroll', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const tutorialId = req.params.id;
  const connection = mysql.createConnection(dbConfig);
  
  // First check if already enrolled
  connection.query(
    'SELECT 1 FROM enrollments WHERE user_id = ? AND tutorial_id = ?',
    [userId, tutorialId],
    (err, results) => {
      if (err) {
        connection.end();
        return res.status(500).json({ error: 'Database error.' });
      }
      
      if (results.length > 0) {
        connection.end();
        return res.status(400).json({ error: 'Already enrolled in this tutorial.' });
      }
      
      // If not enrolled, proceed with enrollment
      connection.query(
        'INSERT INTO enrollments (user_id, tutorial_id) VALUES (?, ?)',
        [userId, tutorialId],
        (err, result) => {
          connection.end();
          if (err) return res.status(500).json({ error: 'Database error.' });
          res.json({ message: 'Enrolled successfully.' });
        }
      );
    }
  );
});

app.get('/api/my-tutorials', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const connection = mysql.createConnection(dbConfig);
  const sql = `
    SELECT t.*, u.username as instructor_name,
           (SELECT COUNT(*) FROM modules m WHERE m.tutorial_id = t.id) as total_modules,
           (SELECT COUNT(*) FROM module_progress mp 
            JOIN modules m ON mp.module_id = m.id 
            WHERE m.tutorial_id = t.id AND mp.user_id = ? AND mp.progress_percentage = 100) as completed_modules
    FROM enrollments e
    JOIN tutorials t ON e.tutorial_id = t.id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE e.user_id = ?
    ORDER BY e.enrolled_at DESC
  `;
  connection.query(sql, [userId, userId], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    
    // Calculate progress percentage for each tutorial
    const tutorials = results.map(tutorial => ({
      ...tutorial,
      progress: tutorial.total_modules > 0 
        ? Math.round((tutorial.completed_modules / tutorial.total_modules) * 100)
        : 0
    }));
    
    res.json(tutorials);
  });
});

// === Enrollment Statistics Endpoint ===
app.get('/api/enrollment-stats', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  // Get total enrollments, most popular tutorial, and recent enrollments (last 7 days)
  const stats = {};
  connection.query('SELECT COUNT(*) AS total FROM enrollments', (err, results) => {
    if (err) { connection.end(); return res.status(500).json({ error: 'Database error.' }); }
    stats.totalEnrollments = results[0].total;
    // Most popular tutorial
    connection.query(`
      SELECT t.id, t.title, COUNT(e.id) AS count
      FROM tutorials t
      LEFT JOIN enrollments e ON t.id = e.tutorial_id
      GROUP BY t.id
      ORDER BY count DESC
      LIMIT 1
    `, (err, results) => {
      if (err) { connection.end(); return res.status(500).json({ error: 'Database error.' }); }
      stats.mostPopularTutorial = results[0] ? { id: results[0].id, title: results[0].title, count: results[0].count } : null;
      // Recent enrollments (last 7 days)
      connection.query(
        `SELECT COUNT(*) AS recent FROM enrollments WHERE enrolled_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
        (err, results) => {
          connection.end();
          if (err) return res.status(500).json({ error: 'Database error.' });
          stats.recentEnrollments = results[0].recent;
          res.json(stats);
        }
      );
    });
  });
});

// === Enrollment List Endpoint ===
app.get('/api/enrollments', (req, res) => {
  const filter = req.query.filter || 'all';
  const connection = mysql.createConnection(dbConfig);
  let sql = `
    SELECT e.id, e.enrolled_at, u.username AS userName, u.avatar AS userAvatar,
           t.title AS tutorialTitle, t.level AS tutorialLevel
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN tutorials t ON e.tutorial_id = t.id
  `;
  let params = [];
  if (filter === 'recent') {
    sql += ' WHERE e.enrolled_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    sql += ' ORDER BY e.enrolled_at DESC';
  } else if (filter === 'popular') {
    sql += ' ORDER BY t.id, (SELECT COUNT(*) FROM enrollments ee WHERE ee.tutorial_id = t.id) DESC, e.enrolled_at DESC';
  } else {
    sql += ' ORDER BY e.enrolled_at DESC';
  }
  connection.query(sql, params, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    // Format results for frontend
    const enrollments = results.map(e => ({
      userName: e.userName,
      userAvatar: e.userAvatar,
      enrolledAt: e.enrolled_at,
      tutorialTitle: e.tutorialTitle,
      tutorialLevel: e.tutorialLevel
    }));
    res.json(enrollments);
  });
});

// === GET /api/users/profile ===
app.get('/api/users/profile', authenticateToken, (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  
  // First get basic user info
  const basicQuery = `
    SELECT 
      u.id,
      u.username,
      u.full_name,
      u.email,
      u.location,
      u.occupation,
      u.bio,
      u.avatar,
      u.created_at,
      u.years_experience,
      u.verified_skills,
      (SELECT AVG(rating) FROM user_reviews WHERE user_id = u.id) as average_rating,
      (SELECT COUNT(*) FROM user_reviews WHERE user_id = u.id) as total_reviews
    FROM users u
    WHERE u.id = ?
  `;

  connection.query(basicQuery, [req.user.id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      connection.end();
      return res.status(500).json({ error: 'Database error.' });
    }

    if (results.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = results[0];

    // Parse verified_skills if it exists
    let skills = [];
    if (user.verified_skills) {
      try {
        skills = JSON.parse(user.verified_skills);
      } catch (e) {
        console.error('Error parsing verified_skills:', e);
        skills = [];
      }
    }

    // Get reviews
    connection.query(
      `SELECT ur.id, ur.rating, ur.review_text as comment, ur.created_at,
              r.username as reviewer_name, r.avatar as reviewer_avatar
       FROM user_reviews ur
       JOIN users r ON ur.reviewer_id = r.id
       WHERE ur.user_id = ?
       ORDER BY ur.created_at DESC`,
      [req.user.id],
      (err, reviews) => {
        if (err) {
          console.error('Error fetching reviews:', err);
          connection.end();
          return res.status(500).json({ error: 'Error fetching reviews.' });
        }

        // Get activity log
        connection.query(
          `SELECT id, activity_type as type, activity_details as details, created_at as timestamp
           FROM user_activity
           WHERE user_id = ?
           ORDER BY created_at DESC
           LIMIT 10`,
          [req.user.id],
          (err, activityLog) => {
            if (err) {
              console.error('Error fetching activity log:', err);
              connection.end();
              return res.status(500).json({ error: 'Error fetching activity log.' });
            }

            // Get certifications
            connection.query(
              `SELECT id, name, issuing_organization, issue_date, expiry_date, credential_url
               FROM user_certifications
               WHERE user_id = ?
               ORDER BY issue_date DESC`,
              [req.user.id],
              (err, certifications) => {
                connection.end();
                if (err) {
                  console.error('Error fetching certifications:', err);
                  return res.status(500).json({ error: 'Error fetching certifications.' });
                }

                // Format the response
                const formattedUser = {
                  id: user.id,
                  username: user.username,
                  full_name: user.full_name,
                  email: user.email,
                  location: user.location,
                  occupation: user.occupation,
                  bio: user.bio,
                  avatar: user.avatar,
                  created_at: user.created_at,
                  years_experience: user.years_experience || 0,
                  average_rating: parseFloat(user.average_rating) || 0,
                  total_reviews: parseInt(user.total_reviews) || 0,
                  skills: skills,
                  reviews: reviews || [],
                  activity_log: activityLog || [],
                  certifications: certifications || []
                };

                res.json(formattedUser);
              }
            );
          }
        );
      }
    );
  });
});

// Get any user's profile by ID (protected route)
app.get('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
    const connection = mysql.createConnection(dbConfig);
    connection.query(
        'SELECT id, username, email, full_name, phone, location, occupation, bio, avatar, resume, created_at as member_since FROM users WHERE id=?',
        [userId],
        (err, results) => {
            connection.end();
            if (err || results.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }
            const user = results[0];
            if (user.member_since) {
                user.member_since = new Date(user.member_since).getFullYear();
            }
            res.json(user);
        }
    );
});

// Get tutorial content with modules and progress
app.get('/api/tutorials/:id/content', authenticateToken, (req, res) => {
    const tutorialId = parseInt(req.params.id);
    const userId = req.user.id;
    const connection = mysql.createConnection(dbConfig);

    if (isNaN(tutorialId)) {
        connection.end();
        return res.status(400).json({ error: 'Invalid tutorial ID.' });
    }

    // First, get the tutorial details
    connection.query(
        `SELECT t.*, u.username as instructor_name, u.avatar as instructor_avatar, u.bio as instructor_bio
         FROM tutorials t
         LEFT JOIN users u ON t.created_by = u.id
         WHERE t.id = ?`,
        [tutorialId],
        (err, results) => {
            if (err) {
                connection.end();
                return res.status(500).json({ error: 'Database error.' });
            }

            if (results.length === 0) {
                connection.end();
                return res.status(404).json({ error: 'Tutorial not found.' });
            }

            const tutorial = results[0];

            // Then, get the modules for this tutorial
            connection.query(
                `SELECT m.*, 
                    (SELECT COUNT(*) FROM module_progress mp 
                     WHERE mp.module_id = m.id AND mp.user_id = ? AND mp.progress_percentage = 100) as completed
                 FROM modules m 
                 WHERE m.tutorial_id = ?
                 ORDER BY m.module_order`,
                [userId, tutorialId],
                (err, modules) => {
                    if (err) {
                        connection.end();
                        return res.status(500).json({ error: 'Database error.' });
                    }

                    // For each module, get its resources
                    const modulePromises = modules.map(module => {
                        return new Promise((resolve, reject) => {
                            connection.query(
                                `SELECT * FROM module_resources 
                                 WHERE module_id = ?
                                 ORDER BY resource_order`,
                                [module.id],
                                (err, resources) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    module.resources = resources;
                                    module.completed = module.completed > 0;
                                    resolve(module);
                                }
                            );
                        });
                    });

                    Promise.all(modulePromises)
                        .then(modulesWithResources => {
                            // Calculate overall progress
                            const totalModules = modulesWithResources.length;
                            const completedModules = modulesWithResources.filter(m => m.completed).length;
                            const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

                            // Add modules and progress to tutorial object
                            tutorial.modules = modulesWithResources;
                            tutorial.progress = progress;

                            connection.end();
                            res.json(tutorial);
                        })
                        .catch(err => {
                            connection.end();
                            res.status(500).json({ error: 'Database error.' });
                        });
                }
            );
        }
    );
});

// Update module progress
app.post('/api/tutorials/:id/modules/:moduleId/progress', authenticateToken, (req, res) => {
    const { progress_percentage } = req.body;
    const userId = req.user.id;
    const moduleId = req.params.moduleId;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        `INSERT INTO module_progress (user_id, module_id, progress_percentage)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE progress_percentage = ?`,
        [userId, moduleId, progress_percentage, progress_percentage],
        (err, result) => {
            connection.end();
            if (err) {
                return res.status(500).json({ error: 'Database error.' });
            }
            res.json({ message: 'Progress updated successfully.' });
        }
    );
});

// Mark module as completed
app.post('/api/tutorials/:id/modules/:moduleId/complete', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const moduleId = req.params.moduleId;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        `INSERT INTO module_progress (user_id, module_id, progress_percentage, completed_at)
         VALUES (?, ?, 100, NOW())
         ON DUPLICATE KEY UPDATE progress_percentage = 100, completed_at = NOW()`,
        [userId, moduleId],
        (err, result) => {
            connection.end();
            if (err) {
                return res.status(500).json({ error: 'Database error.' });
            }
            res.json({ message: 'Module marked as completed.' });
        }
    );
});

// Check tutorial enrollment status
app.get('/api/tutorials/:id/enrollment-status', authenticateToken, (req, res) => {
    const tutorialId = parseInt(req.params.id);
    const userId = req.user.id;
    const connection = mysql.createConnection(dbConfig);

    if (isNaN(tutorialId)) {
        connection.end();
        return res.status(400).json({ error: 'Invalid tutorial ID.' });
    }

    connection.query(
        `SELECT COUNT(*) as is_enrolled 
         FROM enrollments 
         WHERE user_id = ? AND tutorial_id = ?`,
        [userId, tutorialId],
        (err, results) => {
            connection.end();
            if (err) {
                return res.status(500).json({ error: 'Database error.' });
            }
            res.json({ is_enrolled: results[0].is_enrolled > 0 });
        }
    );
});

// ===== Swap Request Endpoints =====
app.post('/api/swap-request', authenticateToken, (req, res) => {
  const { receiver_id } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id) {
    return res.status(400).json({ error: 'Receiver ID is required.' });
  }

  const connection = mysql.createConnection(dbConfig);
  
  // First check if a swap request already exists
  connection.query(
    'SELECT * FROM swap_requests WHERE sender_id = ? AND receiver_id = ? AND status = "pending"',
    [sender_id, receiver_id],
    (err, results) => {
      if (err) {
        connection.end();
        return res.status(500).json({ error: 'Database error.' });
      }

      if (results.length > 0) {
        connection.end();
        return res.status(400).json({ error: 'A swap request already exists.' });
      }

      // Create new swap request
      connection.query(
        'INSERT INTO swap_requests (sender_id, receiver_id, status, created_at) VALUES (?, ?, "pending", NOW())',
        [sender_id, receiver_id],
        (err, result) => {
          connection.end();
          if (err) {
            console.error('Error creating swap request:', err);
            return res.status(500).json({ error: 'Failed to create swap request.' });
          }
          res.status(201).json({ 
            message: 'Swap request sent successfully.',
            request_id: result.insertId
          });
        }
      );
    }
  );
});

// Get swap requests for a user
app.get('/api/swap-requests', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const connection = mysql.createConnection(dbConfig);
  
  connection.query(
    `SELECT sr.*, 
      sender.username as sender_username, 
      sender.avatar as sender_avatar,
      receiver.username as receiver_username,
      receiver.avatar as receiver_avatar
    FROM swap_requests sr
    JOIN users sender ON sr.sender_id = sender.id
    JOIN users receiver ON sr.receiver_id = receiver.id
    WHERE sr.sender_id = ? OR sr.receiver_id = ?
    ORDER BY sr.created_at DESC`,
    [userId, userId],
    (err, results) => {
      connection.end();
      if (err) {
        console.error('Error fetching swap requests:', err);
        return res.status(500).json({ error: 'Failed to fetch swap requests.' });
      }
      res.json(results);
    }
  );
});

// Update swap request status
app.put('/api/swap-requests/:requestId', authenticateToken, (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!['accepted', 'declined', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const connection = mysql.createConnection(dbConfig);
  
  // First verify the user has permission to update this request
  connection.query(
    'SELECT * FROM swap_requests WHERE id = ? AND (sender_id = ? OR receiver_id = ?)',
    [requestId, userId, userId],
    (err, results) => {
      if (err) {
        connection.end();
        return res.status(500).json({ error: 'Database error.' });
      }

      if (results.length === 0) {
        connection.end();
        return res.status(404).json({ error: 'Swap request not found or unauthorized.' });
      }

      // Update the request status
      connection.query(
        'UPDATE swap_requests SET status = ? WHERE id = ?',
        [status, requestId],
        (err, result) => {
          connection.end();
          if (err) {
            console.error('Error updating swap request:', err);
            return res.status(500).json({ error: 'Failed to update swap request.' });
          }
          res.json({ message: 'Swap request updated successfully.' });
        }
      );
    }
  );
});

// ===== Users Search Endpoint =====
app.get('/api/users/search', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = `
    SELECT 
      u.id, u.username, u.full_name, u.bio, u.avatar,
      GROUP_CONCAT(s.name) AS skills
    FROM users u
    LEFT JOIN user_skills us ON u.id = us.user_id
    LEFT JOIN skills s ON us.skill_id = s.id
    GROUP BY u.id
  `;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ error: 'Database error.' });
    // Convert skills string to array for each user
    const users = results.map(u => ({
      ...u,
      skills: u.skills ? u.skills.split(',') : []
    }));
    res.json(users);
  });
});

// Store active connections
const clients = new Map();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  // Extract token from query string
  const urlParams = new URLSearchParams(req.url.replace(/^.*\?/, ''));
  const token = urlParams.get('token');
  let userId = null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    console.error('WebSocket JWT verification failed:', err);
    ws.close();
    return;
  }
  console.log(`User ${userId} connected to WebSocket`);
  clients.set(userId, ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      switch (data.type) {
        case 'message':
          // Store message in database
          const connection = mysql.createConnection(dbConfig);
          connection.query(
            'INSERT INTO messages (sender_id, receiver_id, content, type, created_at) VALUES (?, ?, ?, ?, ?)',
            [data.senderId, data.receiverId, data.content, data.messageType, new Date()],
            (err, result) => {
              if (err) {
                console.error('Error saving message:', err);
                return;
              }
              // Get sender's name for the message
              connection.query(
                'SELECT full_name FROM users WHERE id = ?',
                [data.senderId],
                (err, results) => {
                  connection.end();
                  if (err) {
                    console.error('Error getting sender name:', err);
                    return;
                  }
                  const senderName = results[0]?.full_name || 'Unknown User';
                  // Send to recipient if online
                  const recipientWs = clients.get(data.receiverId);
                  if (recipientWs) {
                    recipientWs.send(JSON.stringify({
                      type: 'message',
                      senderId: data.senderId,
                      content: data.content,
                      timestamp: new Date().toISOString(),
                      messageType: data.messageType,
                      senderName: senderName
                    }));
                  }
                  // Send confirmation to sender
                  const senderWs = clients.get(data.senderId);
                  if (senderWs) {
                    senderWs.send(JSON.stringify({
                      type: 'message',
                      senderId: data.senderId,
                      content: data.content,
                      timestamp: new Date().toISOString(),
                      messageType: data.messageType,
                      senderName: senderName
                    }));
                  }
                }
              );
            }
          );
          break;
        case 'typing':
          const typingWs = clients.get(data.receiverId);
          if (typingWs) {
            typingWs.send(JSON.stringify({
              type: 'typing',
              senderId: data.senderId
            }));
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log(`User ${userId} disconnected from WebSocket`);
    clients.delete(userId);
  });
});

// Add new message endpoints
app.get('/api/messages/:userId', authenticateToken, (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const sql = `
    SELECT m.*, 
      u1.full_name as sender_name,
      u2.full_name as receiver_name
     FROM messages m
     JOIN users u1 ON m.sender_id = u1.id
     JOIN users u2 ON m.receiver_id = u2.id
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC
  `;
  connection.query(sql, [req.user.id, req.params.userId, req.params.userId, req.user.id], (err, results) => {
    connection.end();
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json(results);
  });
});

// Get single user details
app.get('/api/users/:userId', authenticateToken, (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const userId = req.params.userId;

  connection.query(
    `SELECT id, username, full_name, avatar, bio 
     FROM users 
     WHERE id = ?`,
    [userId],
    (err, results) => {
      connection.end();
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ error: 'Failed to fetch user details' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(results[0]);
    }
  );
});

// User Type Check Middleware
function checkUserType(req, res, next) {
    const userId = req.user.id;
    const connection = mysql.createConnection(dbConfig);
    
    connection.query(
        'SELECT plan FROM subscriptions WHERE user_id = ? AND status = "active" AND (end_date IS NULL OR end_date > NOW())',
        [userId],
        (err, results) => {
            connection.end();
            if (err) {
                return res.status(500).json({ error: 'Database error.' });
            }
            
            if (results.length === 0) {
                req.userType = 'free';
            } else {
                req.userType = results[0].plan.toLowerCase();
            }
            next();
        }
    );
}

// === Subscription/Payment Endpoint (fixed for real DB) ===
app.post('/api/subscribe', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { plan, method } = req.body;
    if (!userId || !plan || !method) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    const connection = mysql.createConnection(dbConfig);

    // Get plan price and duration
    let amount = 0;
    let duration = 0;
    if (plan.toLowerCase() === 'basic') {
        amount = 349;
        duration = 90; // 3 months in days
    } else if (plan.toLowerCase() === 'pro') {
        amount = 749;
        duration = 180; // 6 months in days
    } else {
        connection.end();
        return res.status(400).json({ error: 'Invalid plan selected.' });
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    // Insert subscription
    connection.query(
        'INSERT INTO subscriptions (user_id, plan, start_date, end_date, status) VALUES (?, ?, NOW(), ?, ?)',
        [userId, plan, endDate, 'active'],
        (err, result) => {
            if (err) {
                connection.end();
                return res.status(500).json({ error: 'Database error (insert subscription).' });
            }
            // Insert payment record
            connection.query(
                'INSERT INTO payments (user_id, amount, payment_date, method, status) VALUES (?, ?, NOW(), ?, ?)',
                [userId, amount, method, 'completed'],
                (err2, result2) => {
                    connection.end();
                    if (err2) {
                        return res.status(500).json({ error: 'Database error (insert payment).' });
                    }
                    res.json({ 
                        message: 'Subscription/payment successful!',
                        userType: plan.toLowerCase(),
                        endDate: endDate
                    });
                }
            );
        }
    );
});

// Get user type endpoint
app.get('/api/user-type', authenticateToken, checkUserType, (req, res) => {
    res.json({ userType: req.userType });
});

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Received contact form submission:', { name, email, subject, message });
  
  if (!name || !email || !subject || !message) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const connection = mysql.createConnection(dbConfig);
  connection.query(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message],
    (err, result) => {
      if (err) {
        console.error('Database error in contact form submission:', err);
        connection.end();
        return res.status(500).json({ error: 'Database error.' });
      }
      console.log('Contact message saved successfully:', result);
      connection.end();
      res.status(201).json({ message: 'Contact message submitted successfully.' });
    }
  );
});

// Delete account endpoint
app.delete('/api/user/delete-account', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ 
      error: 'Password is required for account deletion',
      message: 'Please provide your password to confirm account deletion'
    });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    // First verify the password
    const [user] = await new Promise((resolve, reject) => {
      connection.query('SELECT password FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
          reject(new Error('Database error while verifying user'));
        } else {
          resolve(results);
        }
      });
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Your account could not be found. Please try logging in again.'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Invalid password',
        message: 'The password you entered is incorrect. Please try again.'
      });
    }

    // Start transaction
    await new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) {
          reject(new Error('Failed to start account deletion process'));
        } else {
          resolve();
        }
      });
    });

    // Delete user's data from all related tables
    const tables = [
      'user_skills',
      'user_certifications',
      'user_activity',
      'user_reviews',
      'messages',
      'feedback',
      'course_enrollments',
      'enrollments',
      'contact_messages',
      'swap_requests',
      'module_progress',
      'subscriptions',
      'payments'
    ];

    for (const table of tables) {
      try {
        await new Promise((resolve, reject) => {
          connection.query(`DELETE FROM ${table} WHERE user_id = ?`, [userId], (err) => {
            if (err) {
              reject(new Error(`Failed to delete user data from ${table}`));
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        throw new Error(`Error while deleting user data: ${error.message}`);
      }
    }

    // Finally delete the user
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
          reject(new Error('Failed to delete user account'));
        } else {
          resolve();
        }
      });
    });

    // Commit transaction
    await new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) {
          reject(new Error('Failed to complete account deletion'));
        } else {
          resolve();
        }
      });
    });

    res.json({ 
      message: 'Account deleted successfully',
      success: true
    });
  } catch (error) {
    // Rollback on error
    await new Promise((resolve) => {
      connection.rollback(() => resolve());
    });
    
    res.status(500).json({ 
      error: 'Failed to delete account',
      message: error.message || 'An unexpected error occurred while deleting your account'
    });
  } finally {
    connection.end();
  }
});

// Get user's joined events
app.get('/api/my-events', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const connection = mysql.createConnection(dbConfig);
        const query = `
            SELECT e.*, er.registration_date 
            FROM events e
            INNER JOIN event_registrations er ON e.id = er.event_id
            WHERE er.user_id = ? AND er.status = 'registered'
            ORDER BY e.event_date ASC
        `;
        connection.query(query, [userId], (error, results) => {
            connection.end();
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Failed to fetch events' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to check if user is an instructor
function isInstructor(req, res, next) {
    if (req.user && req.user.role === 'instructor') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Instructor role required.' });
    }
}

// Get instructor profile
app.get('/api/instructor/profile', authenticateToken, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const userId = req.user.id;
    connection.query(
        `SELECT u.id, u.username, u.full_name, u.email, u.avatar, u.bio, u.location, u.occupation,
                iu.instructor_type, iu.years_of_experience, iu.expertise_level, iu.specialization,
                iu.hourly_rate, iu.total_students, iu.total_courses, iu.average_rating, iu.total_reviews,
                iu.is_verified, iu.verification_date, iu.verification_documents, iu.teaching_certificates, iu.available_hours,
                iu.preferred_teaching_method, iu.preferred_teaching_platform, iu.bio as instructor_bio, iu.achievements, iu.social_links
         FROM users u
         JOIN instructor_users iu ON u.id = iu.user_id
         WHERE u.id = ?`,
        [userId],
        (err, results) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Database error.' });
            if (results.length === 0) return res.status(404).json({ error: 'Instructor profile not found.' });
            res.json(results[0]);
        }
    );
});

// Get instructor's tutorials
app.get('/api/instructor/tutorials', authenticateToken, isInstructor, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    connection.query(
        `SELECT t.*, 
            (SELECT COUNT(*) FROM course_enrollments WHERE course_id = t.id) as enrolled_students
        FROM tutorials t
        WHERE t.created_by = ?
        ORDER BY t.created_at DESC`,
        [req.user.id],
        (err, results) => {
            connection.end();
            if (err) {
                return res.status(500).json({ error: 'Database error.' });
            }
            res.json(results);
        }
    );
});

// Get instructor dashboard stats and all related data
app.get('/api/instructor/dashboard', authenticateToken, isInstructor, async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const instructorId = req.user.id;

    try {
        // Fetch all related data
        const [profile] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [instructorProfile] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM instructor_users WHERE user_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [earnings] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM instructor_earnings WHERE instructor_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [reviews] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM instructor_reviews WHERE instructor_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [certifications] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM instructor_certifications WHERE instructor_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [availability] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM instructor_availability WHERE instructor_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [privateLessons] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM private_lessons WHERE instructor_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [consultations] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM consultation_requests WHERE instructor_id = ?', [instructorId], (err, results) => resolve([results]));
        });
        const [tutorials] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tutorials WHERE created_by = ?', [instructorId], (err, results) => resolve([results]));
        });

        connection.end();
        res.json({
            profile: profile[0] || {},
            instructorProfile: instructorProfile[0] || {},
            earnings,
            reviews,
            certifications,
            availability,
            privateLessons,
            consultations,
            tutorials
        });
    } catch (error) {
        connection.end();
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Manage instructor certifications
app.post('/api/instructor/certifications', authenticateToken, isInstructor, (req, res) => {
    const { certification_name, issuing_organization, issue_date, expiry_date, credential_url } = req.body;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        'INSERT INTO instructor_certifications (instructor_id, certification_name, issuing_organization, issue_date, expiry_date, credential_url) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, certification_name, issuing_organization, issue_date, expiry_date, credential_url],
        (err, result) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to add certification' });
            res.status(201).json({ message: 'Certification added successfully', id: result.insertId });
        }
    );
});

// Get instructor certifications
app.get('/api/instructor/certifications', authenticateToken, isInstructor, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.query(
        'SELECT * FROM instructor_certifications WHERE instructor_id = ? ORDER BY issue_date DESC',
        [req.user.id],
        (err, results) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to fetch certifications' });
            res.json(results);
        }
    );
});

// Manage instructor availability
app.post('/api/instructor/availability', authenticateToken, isInstructor, (req, res) => {
    const { day_of_week, start_time, end_time, is_available } = req.body;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        'INSERT INTO instructor_availability (instructor_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, day_of_week, start_time, end_time, is_available],
        (err, result) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to add availability' });
            res.status(201).json({ message: 'Availability added successfully', id: result.insertId });
        }
    );
});

// Get instructor availability
app.get('/api/instructor/availability', authenticateToken, isInstructor, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.query(
        'SELECT * FROM instructor_availability WHERE instructor_id = ? ORDER BY day_of_week, start_time',
        [req.user.id],
        (err, results) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to fetch availability' });
            res.json(results);
        }
    );
});

// Schedule private lesson
app.post('/api/instructor/private-lessons', authenticateToken, isInstructor, (req, res) => {
    const { student_id, title, description, start_time, end_time, price } = req.body;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        'INSERT INTO private_lessons (instructor_id, student_id, title, description, start_time, end_time, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, student_id, title, description, start_time, end_time, price],
        (err, result) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to schedule lesson' });
            res.status(201).json({ message: 'Lesson scheduled successfully', id: result.insertId });
        }
    );
});

// Get instructor's private lessons
app.get('/api/instructor/private-lessons', authenticateToken, isInstructor, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.query(
        `SELECT pl.*, u.username as student_name, u.avatar as student_avatar
         FROM private_lessons pl
         JOIN users u ON pl.student_id = u.id
         WHERE pl.instructor_id = ?
         ORDER BY pl.start_time DESC`,
        [req.user.id],
        (err, results) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to fetch lessons' });
            res.json(results);
        }
    );
});

// Handle consultation requests
app.post('/api/instructor/consultations', authenticateToken, isInstructor, (req, res) => {
    const { student_id, topic, description, preferred_date, preferred_time, duration, price } = req.body;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        'INSERT INTO consultation_requests (instructor_id, student_id, topic, description, preferred_date, preferred_time, duration, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, student_id, topic, description, preferred_date, preferred_time, duration, price],
        (err, result) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to create consultation request' });
            res.status(201).json({ message: 'Consultation request created successfully', id: result.insertId });
        }
    );
});

// Get instructor's consultation requests
app.get('/api/instructor/consultations', authenticateToken, isInstructor, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.query(
        `SELECT cr.*, u.username as student_name, u.avatar as student_avatar
         FROM consultation_requests cr
         JOIN users u ON cr.student_id = u.id
         WHERE cr.instructor_id = ?
         ORDER BY cr.created_at DESC`,
        [req.user.id],
        (err, results) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to fetch consultation requests' });
            res.json(results);
        }
    );
});

// Update consultation request status
app.put('/api/instructor/consultations/:id', authenticateToken, isInstructor, (req, res) => {
    const { status } = req.body;
    const connection = mysql.createConnection(dbConfig);

    connection.query(
        'UPDATE consultation_requests SET status = ? WHERE id = ? AND instructor_id = ?',
        [status, req.params.id, req.user.id],
        (err, result) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to update consultation request' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Consultation request not found' });
            }
            res.json({ message: 'Consultation request updated successfully' });
        }
    );
});

// Get instructor earnings
app.get('/api/instructor/earnings', authenticateToken, isInstructor, (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.query(
        `SELECT ie.*, 
         CASE 
             WHEN ie.source = 'tutorial' THEN t.title
             WHEN ie.source = 'private_lesson' THEN pl.title
             WHEN ie.source = 'consultation' THEN cr.topic
         END as source_title
         FROM instructor_earnings ie
         LEFT JOIN tutorials t ON ie.source = 'tutorial' AND ie.source_id = t.id
         LEFT JOIN private_lessons pl ON ie.source = 'private_lesson' AND ie.source_id = pl.id
         LEFT JOIN consultation_requests cr ON ie.source = 'consultation' AND ie.source_id = cr.id
         WHERE ie.instructor_id = ?
         ORDER BY ie.created_at DESC`,
        [req.user.id],
        (err, results) => {
            connection.end();
            if (err) return res.status(500).json({ error: 'Failed to fetch earnings' });
            res.json(results);
        }
    );
});

// Create tutorials table if it doesn't exist
const createTutorialsTable = `
CREATE TABLE IF NOT EXISTS tutorials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    category VARCHAR(100),
    duration INT,
    rating DECIMAL(3,2),
    students INT DEFAULT 0,
    image VARCHAR(255),
    price DECIMAL(10,2),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
)`;

// Create modules table if it doesn't exist
const createModulesTable = `
CREATE TABLE IF NOT EXISTS modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tutorial_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE
)`;

// Create module_resources table if it doesn't exist
const createModuleResourcesTable = `
CREATE TABLE IF NOT EXISTS module_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type ENUM('video', 'document', 'quiz', 'assignment') NOT NULL,
    resource_url VARCHAR(255),
    resource_order INT NOT NULL,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
)`;

// Create module_progress table if it doesn't exist
const createModuleProgressTable = `
CREATE TABLE IF NOT EXISTS module_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    progress_percentage INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (user_id, module_id)
)`;

// Execute table creation
const tutorialDbConnection = mysql.createConnection(dbConfig);
tutorialDbConnection.query(createTutorialsTable, (err) => {
    if (err) {
        console.error('Error creating tutorials table:', err);
    } else {
        console.log('Tutorials table checked/created successfully');
        
        // Create modules table after tutorials table
        tutorialDbConnection.query(createModulesTable, (err) => {
            if (err) {
                console.error('Error creating modules table:', err);
            } else {
                console.log('Modules table checked/created successfully');
                
                // Create module_resources table after modules table
                tutorialDbConnection.query(createModuleResourcesTable, (err) => {
                    if (err) {
                        console.error('Error creating module_resources table:', err);
                    } else {
                        console.log('Module resources table checked/created successfully');
                        
                        // Create module_progress table after module_resources table
                        tutorialDbConnection.query(createModuleProgressTable, (err) => {
                            if (err) {
                                console.error('Error creating module_progress table:', err);
                            } else {
                                console.log('Module progress table checked/created successfully');
                            }
                            tutorialDbConnection.end();
                        });
                    }
                });
            }
        });
    }
});

// Tutorial video upload endpoint
app.post('/api/tutorials/:tutorialId/modules/:moduleId/video', authenticateToken, upload.single('video'), async (req, res) => {
  const { tutorialId, moduleId } = req.params;
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded.' });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    // Check if user is the tutorial creator
    const [tutorial] = await connection.promise().query(
      'SELECT created_by FROM tutorials WHERE id = ?',
      [tutorialId]
    );

    if (!tutorial.length || tutorial[0].created_by !== userId) {
      return res.status(403).json({ error: 'Not authorized to upload videos for this tutorial.' });
    }

    // Check if module exists and belongs to the tutorial
    const [module] = await connection.promise().query(
      'SELECT id FROM modules WHERE id = ? AND tutorial_id = ?',
      [moduleId, tutorialId]
    );

    if (!module.length) {
      return res.status(404).json({ error: 'Module not found.' });
    }

    // Update module with video URL
    const videoUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    await connection.promise().query(
      'UPDATE modules SET video_url = ? WHERE id = ?',
      [videoUrl, moduleId]
    );

    res.json({
      message: 'Video uploaded successfully.',
      videoUrl: videoUrl
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video.' });
  } finally {
    connection.end();
  }
});
