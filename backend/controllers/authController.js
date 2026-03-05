const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../../database/users.json');

// Helper to get users
const getUsers = () => {
    if (!fs.existsSync(usersFile)) {
        const dbDir = path.dirname(usersFile);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        fs.writeFileSync(usersFile, JSON.stringify([]));
        return [];
    }
    return JSON.parse(fs.readFileSync(usersFile));
};

// Helper to save users
const saveUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Initialize with one default API Key
    const apiKey = 'nscs_' + Math.random().toString(36).substr(2, 16);
    const newKey = {
        id: Date.now().toString(),
        name: 'Default Key',
        value: apiKey,
        created: new Date().toISOString().split('T')[0]
    };

    users.push({
        username,
        email,
        password,
        apiKeys: [newKey]
    });
    saveUsers(users);

    // Create isolated storage directory
    const userStoragePath = path.join(__dirname, '../../storage', email);
    if (!fs.existsSync(userStoragePath)) {
        fs.mkdirSync(userStoragePath, { recursive: true });
    }

    res.status(201).json({ message: 'User registered and cloud environment isolated.' });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({
            username: user.username,
            email: user.email,
            apiKeys: user.apiKeys
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

exports.getKeys = (req, res) => {
    const email = req.headers['x-user-email'];
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).send('User not found');
    res.json(user.apiKeys || []);
};

exports.createKey = (req, res) => {
    const email = req.headers['x-user-email'];
    const { name } = req.body;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) return res.status(404).send('User not found');

    const apiKey = 'nscs_' + Math.random().toString(36).substr(2, 16);
    const newKey = {
        id: Date.now().toString(),
        name: name || 'New Key',
        value: apiKey,
        created: new Date().toISOString().split('T')[0]
    };

    if (!users[userIndex].apiKeys) users[userIndex].apiKeys = [];
    users[userIndex].apiKeys.push(newKey);
    saveUsers(users);
    res.status(201).json(newKey);
};

exports.deleteKey = (req, res) => {
    const email = req.headers['x-user-email'];
    const { id } = req.params;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) return res.status(404).send('User not found');

    users[userIndex].apiKeys = users[userIndex].apiKeys.filter(k => k.id !== id);
    saveUsers(users);
    res.send('Key deleted');
};
