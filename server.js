const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'your-secret-key'; // Change this to a secure secret key

// In-memory storage (replace with database in production)
const users = new Map();
const chats = new Map();
const messages = new Map();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle authentication
    socket.on('authenticate', (token) => {
        try {
            const user = jwt.verify(token, JWT_SECRET);
            socket.userId = user.id;
            users.set(user.id, { ...user, socketId: socket.id, online: true });
            console.log(`User ${user.id} authenticated`);
            
            // Notify others about user's online status
            socket.broadcast.emit('userStatus', {
                userId: user.id,
                online: true
            });
        } catch (error) {
            socket.disconnect();
        }
    });

    // Handle messages
    socket.on('message', (message) => {
        const chat = chats.get(message.chatId);
        if (!chat) return;

        const newMessage = {
            id: Date.now().toString(),
            chatId: message.chatId,
            senderId: socket.userId,
            content: message.content,
            timestamp: message.timestamp
        };

        // Store message
        if (!messages.has(message.chatId)) {
            messages.set(message.chatId, []);
        }
        messages.get(message.chatId).push(newMessage);

        // Update chat's last message
        chat.lastMessage = message.content;
        chat.lastMessageTime = message.timestamp;

        // Send message to all participants
        chat.participants.forEach(participantId => {
            const participant = users.get(participantId);
            if (participant && participant.socketId) {
                io.to(participant.socketId).emit('message', newMessage);
            }
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.userId) {
            const user = users.get(socket.userId);
            if (user) {
                user.online = false;
                user.socketId = null;
                // Notify others about user's offline status
                socket.broadcast.emit('userStatus', {
                    userId: socket.userId,
                    online: false
                });
            }
        }
        console.log('Client disconnected');
    });
});

// API Routes
app.get('/api/users/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

app.get('/api/users', authenticateToken, (req, res) => {
    const userList = Array.from(users.values())
        .filter(user => user.id !== req.user.id)
        .map(user => ({
            id: user.id,
            name: user.name,
            online: user.online
        }));
    res.json(userList);
});

app.get('/api/chats', authenticateToken, (req, res) => {
    const userChats = Array.from(chats.values())
        .filter(chat => chat.participants.includes(req.user.id))
        .map(chat => ({
            ...chat,
            participants: chat.participants.map(id => {
                const user = users.get(id);
                return {
                    id: user.id,
                    name: user.name,
                    online: user.online
                };
            })
        }));
    res.json(userChats);
});

app.get('/api/chats/:chatId/messages', authenticateToken, (req, res) => {
    const chat = chats.get(req.params.chatId);
    if (!chat || !chat.participants.includes(req.user.id)) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(messages.get(req.params.chatId) || []);
});

app.post('/api/chats', authenticateToken, (req, res) => {
    const { participantId } = req.body;
    
    // Check if chat already exists
    const existingChat = Array.from(chats.values()).find(chat => 
        chat.participants.includes(req.user.id) && 
        chat.participants.includes(participantId)
    );

    if (existingChat) {
        return res.json(existingChat);
    }

    // Create new chat
    const newChat = {
        id: Date.now().toString(),
        participants: [req.user.id, participantId],
        lastMessage: null,
        lastMessageTime: null
    };

    chats.set(newChat.id, newChat);
    res.json(newChat);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 