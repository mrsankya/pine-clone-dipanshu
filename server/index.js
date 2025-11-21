
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Mock DB
let pins = [
    {
        id: '1',
        title: 'Cozy Reading Corner',
        imageUrl: 'https://picsum.photos/400/600?random=1',
        author: 'InteriorDaily',
        userId: 'system',
        likedBy: []
    },
    {
        id: '2',
        title: 'Mountain Hiking',
        imageUrl: 'https://picsum.photos/400/400?random=2',
        author: 'AdventureTime',
        userId: 'system',
        likedBy: []
    },
];

let users = [
    {
        id: 'default-admin',
        username: 'xyz',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
    }
];

let notifications = [];

// Helper to get user from request headers (Simulating auth middleware)
const getUserFromHeader = (req) => {
    return {
        id: req.headers['x-user-id'],
        role: req.headers['x-user-role'],
        username: req.headers['x-user-name']
    };
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
    }

    const role = username === 'xyz' ? 'admin' : 'user';

    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, 
        role
    };
    
    users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    res.json({ user: safeUser, token: "mock-jwt-token-" + newUser.id });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.username === 'xyz') user.role = 'admin';

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token: "mock-jwt-token-" + user.id });
});

// Pin Routes
app.get('/api/pins', (req, res) => {
    res.json(pins);
});

app.post('/api/pins', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    const user = getUserFromHeader(req);

    const newPin = {
        id: Date.now().toString(),
        title: req.body.title || 'Untitled',
        imageUrl: imageUrl,
        author: req.body.author || 'Anonymous',
        userId: user.id || 'anonymous',
        likedBy: []
    };

    pins.unshift(newPin);
    res.json(newPin);
});

app.put('/api/pins/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const user = getUserFromHeader(req);

    const pinIndex = pins.findIndex(p => p.id === id);
    if (pinIndex === -1) return res.status(404).json({ error: "Pin not found" });

    const pin = pins[pinIndex];

    if (pin.userId !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized" });
    }

    pins[pinIndex] = { ...pin, title };
    res.json(pins[pinIndex]);
});

app.delete('/api/pins/:id', (req, res) => {
    const { id } = req.params;
    const user = getUserFromHeader(req);

    const pin = pins.find(p => p.id === id);
    if (!pin) return res.status(404).json({ error: "Pin not found" });

    if (pin.userId !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized" });
    }

    pins = pins.filter(p => p.id !== id);
    // Also remove related notifications
    notifications = notifications.filter(n => n.pinId !== id);
    
    res.json({ success: true });
});

// Like / Unlike Endpoint
app.post('/api/pins/:id/like', (req, res) => {
    const { id } = req.params;
    const user = getUserFromHeader(req);
    
    if (!user.id) return res.status(401).json({ error: "Unauthorized" });

    const pinIndex = pins.findIndex(p => p.id === id);
    if (pinIndex === -1) return res.status(404).json({ error: "Pin not found" });

    const pin = pins[pinIndex];
    if (!pin.likedBy) pin.likedBy = [];

    const alreadyLiked = pin.likedBy.includes(user.id);
    
    if (alreadyLiked) {
        // Unlike
        pin.likedBy = pin.likedBy.filter(uid => uid !== user.id);
    } else {
        // Like
        pin.likedBy.push(user.id);
        
        // Create Notification
        // Don't notify if user likes their own pin
        if (pin.userId && pin.userId !== user.id) {
            notifications.unshift({
                id: Date.now().toString(),
                recipientId: pin.userId,
                senderId: user.id,
                senderName: user.username || 'Someone',
                type: 'like',
                pinId: pin.id,
                pinImage: pin.imageUrl,
                message: 'liked your pin',
                isRead: false,
                createdAt: Date.now()
            });
        }
    }
    
    pins[pinIndex] = pin;
    res.json(pin);
});

// Notification Routes
app.get('/api/notifications', (req, res) => {
    const user = getUserFromHeader(req);
    if (!user.id) return res.status(401).json({ error: "Unauthorized" });

    const userNotifications = notifications.filter(n => n.recipientId === user.id);
    res.json(userNotifications);
});

app.post('/api/notifications/mark-read', (req, res) => {
    const user = getUserFromHeader(req);
    if (!user.id) return res.status(401).json({ error: "Unauthorized" });

    notifications = notifications.map(n => {
        if (n.recipientId === user.id) {
            return { ...n, isRead: true };
        }
        return n;
    });

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
