-- Skill Bridge Database Schema

CREATE DATABASE IF NOT EXISTS `skill-bridge`;
USE `skill-bridge`;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar VARCHAR(255),
    role ENUM('user', 'instructor') DEFAULT 'user',
    expertise TEXT,
    teaching_experience TEXT,
    hourly_rate DECIMAL(10,2),
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- UserSkills Table
CREATE TABLE IF NOT EXISTS user_skills (
    user_id INT,
    skill_id INT,
    level VARCHAR(50),
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_date DATETIME,
    location VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plan VARCHAR(50) NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    status VARCHAR(20) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tutorial Requests Table
CREATE TABLE IF NOT EXISTS tutorial_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    skill_id INT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Course Enrollments Table
CREATE TABLE IF NOT EXISTS course_enrollments (
    user_id INT,
    course_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Swap Requests Table
CREATE TABLE IF NOT EXISTS swap_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tutorials Table
CREATE TABLE IF NOT EXISTS tutorials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    rating DECIMAL(3,2),
    students INT DEFAULT 0,
    image VARCHAR(255),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Instructor Certifications Table
CREATE TABLE IF NOT EXISTS instructor_certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Instructor Availability Table
CREATE TABLE IF NOT EXISTS instructor_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Instructor Reviews Table
CREATE TABLE IF NOT EXISTS instructor_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    student_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Instructor Earnings Table
CREATE TABLE IF NOT EXISTS instructor_earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    source ENUM('tutorial', 'private_lesson', 'consultation') NOT NULL,
    source_id INT NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Private Lessons Table
CREATE TABLE IF NOT EXISTS private_lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Instructor Consultation Requests Table
CREATE TABLE IF NOT EXISTS consultation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    student_id INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    description TEXT,
    preferred_date DATE,
    preferred_time TIME,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Sample Data

-- Insert sample users (passwords are hashed versions of 'password123')
INSERT INTO users (username, email, password, bio, avatar) VALUES
('john_doe', 'john@example.com', '$2b$10$YourHashedPasswordHere', 'Experienced web developer and instructor', 'https://randomuser.me/api/portraits/men/1.jpg'),
('jane_smith', 'jane@example.com', '$2b$10$YourHashedPasswordHere', 'Data science expert and educator', 'https://randomuser.me/api/portraits/women/2.jpg'),
('mark_wilson', 'mark@example.com', '$2b$10$YourHashedPasswordHere', 'Digital marketing specialist', 'https://randomuser.me/api/portraits/men/3.jpg'),
('sarah_jones', 'sarah@example.com', '$2b$10$YourHashedPasswordHere', 'UI/UX designer and creative director', 'https://randomuser.me/api/portraits/women/4.jpg'),
('alex_brown', 'alex@example.com', '$2b$10$YourHashedPasswordHere', 'Mobile app developer and tech enthusiast', 'https://randomuser.me/api/portraits/men/5.jpg'),
('emily_chen', 'emily@example.com', '$2b$10$YourHashedPasswordHere', 'Cloud computing and DevOps engineer', 'https://randomuser.me/api/portraits/women/6.jpg'),
('michael_lee', 'michael@example.com', '$2b$10$YourHashedPasswordHere', 'Cybersecurity analyst and trainer', 'https://randomuser.me/api/portraits/men/7.jpg'),
('lina_gomez', 'lina@example.com', '$2b$10$YourHashedPasswordHere', 'Project manager and agile coach', 'https://randomuser.me/api/portraits/women/8.jpg'),
('david_kim', 'david@example.com', '$2b$10$YourHashedPasswordHere', 'Copywriter and content strategist', 'https://randomuser.me/api/portraits/men/9.jpg'),
('grace_park', 'grace@example.com', '$2b$10$YourHashedPasswordHere', 'Business analyst and public speaker', 'https://randomuser.me/api/portraits/women/10.jpg');

-- Insert sample skills
INSERT INTO skills (name, description) VALUES
('Web Development', 'Learn to build modern websites and web applications'),
('Data Science', 'Master data analysis, visualization, and machine learning'),
('Digital Marketing', 'Learn SEO, social media marketing, and content strategy'),
('UI/UX Design', 'Create beautiful and user-friendly interfaces'),
('Mobile Development', 'Build iOS and Android applications'),
('Cloud Computing', 'Master AWS, Azure, and cloud architecture'),
('Cybersecurity', 'Learn to protect systems and networks'),
('Project Management', 'Manage projects effectively using modern methodologies'),
('Copywriting', 'Craft compelling copy for brands and products'),
('Public Speaking', 'Develop effective communication and presentation skills'),
('Graphic Design', 'Create visual content using modern tools'),
('Photography', 'Master the art and technique of photography');

-- Insert sample user skills with levels
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(1, 1, 'Expert'),
(1, 5, 'Advanced'),
(1, 11, 'Intermediate'),
(2, 2, 'Expert'),
(2, 1, 'Intermediate'),
(2, 11, 'Advanced'),
(3, 3, 'Expert'),
(3, 9, 'Advanced'),
(3, 10, 'Intermediate'),
(4, 4, 'Expert'),
(4, 11, 'Expert'),
(4, 12, 'Intermediate'),
(5, 5, 'Expert'),
(5, 1, 'Advanced'),
(5, 6, 'Intermediate'),
(6, 6, 'Expert'),
(6, 7, 'Advanced'),
(6, 1, 'Intermediate'),
(7, 7, 'Expert'),
(7, 6, 'Intermediate'),
(8, 8, 'Expert'),
(8, 1, 'Intermediate'),
(8, 4, 'Advanced'),
(9, 9, 'Expert'),
(9, 3, 'Advanced'),
(10, 10, 'Expert'),
(10, 8, 'Advanced'),
(10, 2, 'Intermediate');

-- Insert sample courses
INSERT INTO courses (title, description, created_by) VALUES
('Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, and modern frameworks', 1),
('Data Science Fundamentals', 'Master Python, pandas, and data visualization', 2),
('Digital Marketing Masterclass', 'Comprehensive guide to modern marketing strategies', 3),
('UI/UX Design Principles', 'Learn design thinking and user experience', 4),
('Mobile App Development', 'Build iOS and Android apps with React Native', 5);

-- Insert sample events
INSERT INTO events (title, description, event_date, location, created_by) VALUES
('Web Development Workshop', 'Hands-on workshop for beginners', '2024-04-15 10:00:00', 'Online', 1),
('Data Science Meetup', 'Networking and knowledge sharing', '2024-04-20 18:00:00', 'Tech Hub, Cairo', 2),
('Digital Marketing Conference', 'Annual marketing trends and strategies', '2024-05-01 09:00:00', 'Convention Center', 3),
('UI/UX Design Sprint', '5-day intensive design workshop', '2024-04-25 09:00:00', 'Design Studio', 4),
('Tech Career Fair', 'Connect with top tech companies', '2024-05-10 10:00:00', 'Exhibition Center', 5);

-- Insert sample feedback
INSERT INTO feedback (user_id, message) VALUES
(1, 'The web development course was excellent! Very comprehensive and well-structured.'),
(2, 'Great platform for learning new skills. The instructors are very knowledgeable.'),
(3, 'The community is very supportive and helpful. Love the interactive sessions!'),
(4, 'The mobile development course helped me land my first job in tech!'),
(5, 'Good content but could use more practical exercises.');

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, plan, start_date, end_date, status) VALUES
(1, 'premium', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active'),
(2, 'basic', '2024-01-01 00:00:00', '2024-06-30 23:59:59', 'active'),
(3, 'premium', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active'),
(4, 'basic', '2024-01-01 00:00:00', '2024-06-30 23:59:59', 'active'),
(5, 'premium', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active');

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, content) VALUES
(1, 2, 'Hi Jane, I have a question about the data science course.'),
(2, 1, 'Sure John, what would you like to know?'),
(3, 4, 'Sarah, can we discuss the UI design project?'),
(4, 3, 'Of course Mark, I''m available tomorrow.'),
(5, 1, 'John, thanks for the great workshop!');

-- Insert sample notifications
INSERT INTO notifications (user_id, message, is_read) VALUES
(1, 'New course enrollment: Web Development Bootcamp', false),
(2, 'Your feedback has been received', true),
(3, 'Upcoming event: Digital Marketing Conference', false),
(4, 'New message from Mark Wilson', false),
(5, 'Course completion: Mobile App Development', true);

-- Insert sample tutorial requests
INSERT INTO tutorial_requests (user_id, skill_id, description, status) VALUES
(1, 1, 'Need help with React.js implementation', 'pending'),
(2, 2, 'Looking for guidance on machine learning algorithms', 'pending'),
(3, 3, 'SEO optimization techniques', 'pending'),
(4, 4, 'Design system implementation', 'pending'),
(5, 5, 'Flutter app development', 'pending');

-- Insert sample payments
INSERT INTO payments (user_id, amount, method, status) VALUES
(1, 99.99, 'credit_card', 'completed'),
(2, 149.99, 'paypal', 'completed'),
(3, 79.99, 'credit_card', 'completed'),
(4, 129.99, 'paypal', 'completed'),
(5, 199.99, 'credit_card', 'completed');

-- Insert sample course enrollments
INSERT INTO course_enrollments (user_id, course_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Add new users with many skills and unique avatars
INSERT INTO users (username, email, password, bio, avatar) VALUES
('oliver_martin', 'oliver@example.com', '$2b$10$YourHashedPasswordHere', 'Full-stack developer and mentor', 'images/avatars/avatar17.jpg'),
('sophia_clark', 'sophia@example.com', '$2b$10$YourHashedPasswordHere', 'AI researcher and data scientist', 'images/avatars/avatar18.jpg'),
('liam_turner', 'liam@example.com', '$2b$10$YourHashedPasswordHere', 'Marketing strategist and SEO expert', 'images/avatars/avatar19.jpg'),
('mia_evans', 'mia@example.com', '$2b$10$YourHashedPasswordHere', 'UX/UI designer and illustrator', 'images/avatars/avatar20.jpg'),
('noah_hall', 'noah@example.com', '$2b$10$YourHashedPasswordHere', 'Mobile developer and cloud architect', 'images/avatars/avatar21.jpg'),
('ava_wright', 'ava@example.com', '$2b$10$YourHashedPasswordHere', 'Project manager and public speaker', 'images/avatars/avatar22.jpg');

-- Assign all skills to each new user (user_ids 11-16, assuming auto-increment)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(11, 1, 'Expert'), (11, 2, 'Advanced'), (11, 3, 'Expert'), (11, 4, 'Advanced'), (11, 5, 'Expert'), (11, 6, 'Advanced'), (11, 7, 'Expert'), (11, 8, 'Advanced'), (11, 9, 'Expert'), (11, 10, 'Advanced'), (11, 11, 'Expert'), (11, 12, 'Advanced'),
(12, 1, 'Advanced'), (12, 2, 'Expert'), (12, 3, 'Advanced'), (12, 4, 'Expert'), (12, 5, 'Advanced'), (12, 6, 'Expert'), (12, 7, 'Advanced'), (12, 8, 'Expert'), (12, 9, 'Advanced'), (12, 10, 'Expert'), (12, 11, 'Advanced'), (12, 12, 'Expert'),
(13, 1, 'Expert'), (13, 2, 'Expert'), (13, 3, 'Expert'), (13, 4, 'Expert'), (13, 5, 'Expert'), (13, 6, 'Expert'), (13, 7, 'Expert'), (13, 8, 'Expert'), (13, 9, 'Expert'), (13, 10, 'Expert'), (13, 11, 'Expert'), (13, 12, 'Expert'),
(14, 1, 'Intermediate'), (14, 2, 'Intermediate'), (14, 3, 'Intermediate'), (14, 4, 'Intermediate'), (14, 5, 'Intermediate'), (14, 6, 'Intermediate'), (14, 7, 'Intermediate'), (14, 8, 'Intermediate'), (14, 9, 'Intermediate'), (14, 10, 'Intermediate'), (14, 11, 'Intermediate'), (14, 12, 'Intermediate'),
(15, 1, 'Advanced'), (15, 2, 'Advanced'), (15, 3, 'Advanced'), (15, 4, 'Advanced'), (15, 5, 'Advanced'), (15, 6, 'Advanced'), (15, 7, 'Advanced'), (15, 8, 'Advanced'), (15, 9, 'Advanced'), (15, 10, 'Advanced'), (15, 11, 'Advanced'), (15, 12, 'Advanced'),
(16, 1, 'Expert'), (16, 3, 'Expert'), (16, 5, 'Expert'), (16, 7, 'Expert'), (16, 9, 'Expert'), (16, 11, 'Expert'), (16, 2, 'Advanced'), (16, 4, 'Advanced'), (16, 6, 'Advanced'), (16, 8, 'Advanced'), (16, 10, 'Advanced'), (16, 12, 'Advanced'); 

-- Lily Cooper (Public Relations, UI/UX Design, Photography, Digital Marketing, Web Development)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(46, (SELECT id FROM skills WHERE name='Public Relations'), 'Expert'),
(46, (SELECT id FROM skills WHERE name='UI/UX Design'), 'Advanced'),
(46, (SELECT id FROM skills WHERE name='Photography'), 'Expert'),
(46, (SELECT id FROM skills WHERE name='Digital Marketing'), 'Advanced'),
(46, (SELECT id FROM skills WHERE name='Web Development'), 'Intermediate');

-- Mason Reed (Game Development, Blockchain, Cloud Computing, Cybersecurity, Data Science)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(47, (SELECT id FROM skills WHERE name='Game Development'), 'Expert'),
(47, (SELECT id FROM skills WHERE name='Blockchain'), 'Advanced'),
(47, (SELECT id FROM skills WHERE name='Cloud Computing'), 'Expert'),
(47, (SELECT id FROM skills WHERE name='Cybersecurity'), 'Advanced'),
(47, (SELECT id FROM skills WHERE name='Data Science'), 'Intermediate');

-- Chloe Bailey (Machine Learning, Data Science, Web Development, UI/UX Design, Graphic Design)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(48, (SELECT id FROM skills WHERE name='Machine Learning'), 'Expert'),
(48, (SELECT id FROM skills WHERE name='Data Science'), 'Advanced'),
(48, (SELECT id FROM skills WHERE name='Web Development'), 'Expert'),
(48, (SELECT id FROM skills WHERE name='UI/UX Design'), 'Advanced'),
(48, (SELECT id FROM skills WHERE name='Graphic Design'), 'Intermediate');

-- Logan Hughes (Foreign Languages, Copywriting, Public Speaking, Photography, Cooking)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(49, (SELECT id FROM skills WHERE name='Foreign Languages'), 'Expert'),
(49, (SELECT id FROM skills WHERE name='Copywriting'), 'Advanced'),
(49, (SELECT id FROM skills WHERE name='Public Speaking'), 'Expert'),
(49, (SELECT id FROM skills WHERE name='Photography'), 'Advanced'),
(49, (SELECT id FROM skills WHERE name='Cooking'), 'Intermediate');

-- Harper Ward (Music Production, Digital Marketing, Entrepreneurship, Public Relations, Personal Finance)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(50, (SELECT id FROM skills WHERE name='Music Production'), 'Expert'),
(50, (SELECT id FROM skills WHERE name='Digital Marketing'), 'Advanced'),
(50, (SELECT id FROM skills WHERE name='Entrepreneurship'), 'Expert'),
(50, (SELECT id FROM skills WHERE name='Public Relations'), 'Advanced'),
(50, (SELECT id FROM skills WHERE name='Personal Finance'), 'Intermediate');

-- Aiden Brooks (Entrepreneurship, Business Analyst, Project Management, Cloud Computing, Blockchain)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(51, (SELECT id FROM skills WHERE name='Entrepreneurship'), 'Expert'),
(51, (SELECT id FROM skills WHERE name='Business Analyst'), 'Advanced'),
(51, (SELECT id FROM skills WHERE name='Project Management'), 'Expert'),
(51, (SELECT id FROM skills WHERE name='Cloud Computing'), 'Advanced'),
(51, (SELECT id FROM skills WHERE name='Blockchain'), 'Intermediate');

-- Ella Foster (Personal Finance, Data Science, Cooking, Photography, Public Speaking)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(52, (SELECT id FROM skills WHERE name='Personal Finance'), 'Expert'),
(52, (SELECT id FROM skills WHERE name='Data Science'), 'Advanced'),
(52, (SELECT id FROM skills WHERE name='Cooking'), 'Expert'),
(52, (SELECT id FROM skills WHERE name='Photography'), 'Advanced'),
(52, (SELECT id FROM skills WHERE name='Public Speaking'), 'Intermediate');

-- Ensure every skill is assigned to at least one user
-- Assign missing skills to users (using users 43-52 for new skills)
INSERT INTO user_skills (user_id, skill_id, level) VALUES
(43, (SELECT id FROM skills WHERE name='Video Editing'), 'Expert'),
(44, (SELECT id FROM skills WHERE name='Blockchain'), 'Expert'),
(45, (SELECT id FROM skills WHERE name='Cooking'), 'Expert'),
(46, (SELECT id FROM skills WHERE name='Public Relations'), 'Expert'),
(47, (SELECT id FROM skills WHERE name='Game Development'), 'Expert'),
(48, (SELECT id FROM skills WHERE name='Machine Learning'), 'Expert'),
(49, (SELECT id FROM skills WHERE name='Foreign Languages'), 'Expert'),
(50, (SELECT id FROM skills WHERE name='Music Production'), 'Expert'),
(51, (SELECT id FROM skills WHERE name='Entrepreneurship'), 'Expert'),
(52, (SELECT id FROM skills WHERE name='Personal Finance'), 'Expert');

-- Insert sample tutorials
INSERT INTO tutorials (title, instructor, level, category, description, duration, rating, students, image, price, created_at, created_by) VALUES
('Python Programming for Beginners', 'John Smith', 'Beginner', 'Programming', 'Learn Python from scratch with hands-on projects and real-world examples.', '8 weeks', 4.5, 1200, 'https://example.com/python-course.jpg', 49.99, NOW(), 1),
('Web Development Bootcamp', 'Sarah Johnson', 'Intermediate', 'Web Development', 'Master HTML, CSS, and JavaScript to build modern web applications.', '12 weeks', 4.8, 2500, 'https://example.com/web-dev.jpg', 79.99, NOW(), 1),
('Data Science Fundamentals', 'Michael Brown', 'Advanced', 'Data Science', 'Learn data analysis, machine learning, and statistical methods.', '16 weeks', 4.7, 1800, 'https://example.com/data-science.jpg', 99.99, NOW(), 1),
('UI/UX Design Masterclass', 'Emily Davis', 'Intermediate', 'Design', 'Create beautiful and user-friendly interfaces with modern design principles.', '10 weeks', 4.6, 1500, 'https://example.com/ui-ux.jpg', 69.99, NOW(), 1),
('Mobile App Development', 'David Wilson', 'Advanced', 'Mobile Development', 'Build iOS and Android apps using React Native and best practices.', '14 weeks', 4.9, 2000, 'https://example.com/mobile-dev.jpg', 89.99, NOW(), 1),
('Digital Marketing Strategy', 'Lisa Anderson', 'Beginner', 'Marketing', 'Learn SEO, social media marketing, and content strategy.', '6 weeks', 4.4, 900, 'https://example.com/marketing.jpg', 39.99, NOW(), 1),
('Machine Learning Essentials', 'Robert Taylor', 'Advanced', 'AI/ML', 'Deep dive into machine learning algorithms and neural networks.', '20 weeks', 4.8, 1600, 'https://example.com/ml.jpg', 129.99, NOW(), 1),
('Cloud Computing with AWS', 'Jennifer Lee', 'Intermediate', 'Cloud Computing', 'Master AWS services and cloud architecture.', '12 weeks', 4.7, 1400, 'https://example.com/aws.jpg', 79.99, NOW(), 1),
('Cybersecurity Fundamentals', 'Thomas White', 'Intermediate', 'Security', 'Learn essential security concepts and best practices.', '10 weeks', 4.6, 1100, 'https://example.com/security.jpg', 69.99, NOW(), 1),
('DevOps Engineering', 'Rachel Green', 'Advanced', 'DevOps', 'Master CI/CD, containerization, and infrastructure as code.', '16 weeks', 4.8, 1300, 'https://example.com/devops.jpg', 99.99, NOW(), 1);

-- Insert sample enrollments for users
INSERT INTO enrollments (user_id, tutorial_id) VALUES
-- User 1 enrollments (John Doe - Web Developer)
(1, 1), -- Python Programming
(1, 2), -- Web Development Bootcamp
(1, 3), -- Data Science Fundamentals

-- User 2 enrollments (Jane Smith - Data Scientist)
(2, 1), -- Python Programming
(2, 3), -- Data Science Fundamentals
(2, 7), -- Machine Learning Essentials

-- User 3 enrollments (Mark Wilson - Digital Marketing)
(3, 2), -- Web Development Bootcamp
(3, 6), -- Digital Marketing Strategy
(3, 4), -- UI/UX Design Masterclass

-- User 4 enrollments (Sarah Jones - UI/UX Designer)
(4, 4), -- UI/UX Design Masterclass
(4, 2), -- Web Development Bootcamp
(4, 9), -- Cybersecurity Fundamentals

-- User 5 enrollments (Alex Brown - Mobile Developer)
(5, 5), -- Mobile App Development
(5, 2), -- Web Development Bootcamp
(5, 8), -- Cloud Computing with AWS

-- User 6 enrollments (Emily Chen - Cloud Engineer)
(6, 8), -- Cloud Computing with AWS
(6, 10), -- DevOps Engineering
(6, 7), -- Machine Learning Essentials

-- User 7 enrollments (Michael Lee - Cybersecurity)
(7, 9), -- Cybersecurity Fundamentals
(7, 10), -- DevOps Engineering
(7, 8), -- Cloud Computing with AWS

-- User 8 enrollments (Lina Gomez - Project Manager)
(8, 2), -- Web Development Bootcamp
(8, 6), -- Digital Marketing Strategy
(8, 4), -- UI/UX Design Masterclass

-- User 9 enrollments (David Kim - Copywriter)
(9, 6), -- Digital Marketing Strategy
(9, 4), -- UI/UX Design Masterclass
(9, 1), -- Python Programming

-- User 10 enrollments (Grace Park - Business Analyst)
(10, 3), -- Data Science Fundamentals
(10, 7), -- Machine Learning Essentials
(10, 6), -- Digital Marketing Strategy

-- Additional enrollments for variety
(1, 8), -- John also enrolled in Cloud Computing
(2, 5), -- Jane also enrolled in Mobile Development
(3, 7), -- Mark also enrolled in Machine Learning
(4, 7), -- Sarah also enrolled in Machine Learning
(5, 7), -- Alex also enrolled in Machine Learning
(6, 3), -- Emily also enrolled in Data Science
(7, 3), -- Michael also enrolled in Data Science
(8, 7), -- Lina also enrolled in Machine Learning
(9, 7), -- David also enrolled in Machine Learning
(10, 8); -- Grace also enrolled in Cloud Computing

-- Now every skill in the skills table is assigned to at least one user.

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tutorial_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (user_id, tutorial_id)
);

-- Insert additional enrollments with specific timestamps
INSERT INTO `enrollments`(`id`, `user_id`, `tutorial_id`, `enrolled_at`) VALUES
(1, 1, 1, '2024-01-15 09:30:00'),
(2, 1, 2, '2024-01-20 14:45:00'),
(3, 1, 3, '2024-02-01 11:20:00'),
(4, 2, 1, '2024-01-16 10:15:00'),
(5, 2, 3, '2024-01-25 16:30:00'),
(6, 2, 7, '2024-02-05 13:45:00'),
(7, 3, 2, '2024-01-18 15:20:00'),
(8, 3, 6, '2024-01-28 09:00:00'),
(9, 3, 4, '2024-02-10 14:30:00'),
(10, 4, 4, '2024-01-20 11:45:00'),
(11, 4, 2, '2024-01-30 16:15:00'),
(12, 4, 9, '2024-02-15 10:30:00'),
(13, 5, 5, '2024-01-22 13:20:00'),
(14, 5, 2, '2024-02-01 15:45:00'),
(15, 5, 8, '2024-02-20 09:15:00'),
(16, 6, 8, '2024-01-25 14:30:00'),
(17, 6, 10, '2024-02-05 11:00:00'),
(18, 6, 7, '2024-02-25 16:45:00'),
(19, 7, 9, '2024-01-28 10:15:00'),
(20, 7, 10, '2024-02-10 13:30:00'),
(21, 7, 8, '2024-02-28 15:00:00'),
(22, 8, 2, '2024-01-30 16:45:00'),
(23, 8, 6, '2024-02-15 09:30:00'),
(24, 8, 4, '2024-03-01 14:15:00'),
(25, 9, 6, '2024-02-01 11:00:00'),
(26, 9, 4, '2024-02-20 15:30:00'),
(27, 9, 1, '2024-03-05 10:45:00'),
(28, 10, 3, '2024-02-05 13:15:00'),
(29, 10, 7, '2024-02-25 16:00:00'),
(30, 10, 6, '2024-03-10 09:45:00'),
(31, 1, 8, '2024-02-10 14:30:00'),
(32, 2, 5, '2024-02-15 11:15:00'),
(33, 3, 7, '2024-02-20 15:45:00'),
(34, 4, 7, '2024-02-25 10:00:00'),
(35, 5, 7, '2024-03-01 13:30:00'),
(36, 6, 3, '2024-03-05 16:15:00'),
(37, 7, 3, '2024-03-10 09:30:00'),
(38, 8, 7, '2024-03-15 14:45:00'),
(39, 9, 7, '2024-03-20 11:00:00'),
(40, 10, 8, '2024-03-25 15:30:00');