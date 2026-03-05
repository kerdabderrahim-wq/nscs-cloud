const fs = require('fs');
const path = require('path');
const axios = require('axios');

const usersFile = path.join(__dirname, '../../database/users.json');

// Helper to get user-specific storage path
const getUserStoragePath = (req) => {
    const userEmail = req.headers['x-user-email'] || 'public';
    const userPath = path.join(__dirname, '../../storage', userEmail);
    if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath, { recursive: true });
    }
    return userPath;
};

exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
};

exports.getFiles = (req, res) => {
    const userPath = getUserStoragePath(req);
    fs.readdir(userPath, (err, files) => {
        if (err) return res.status(500).send('Unable to scan directory');

        const fileList = files.filter(f => !fs.lstatSync(path.join(userPath, f)).isDirectory()).map(file => {
            const stats = fs.statSync(path.join(userPath, file));
            return {
                name: file,
                size: (stats.size / 1024).toFixed(2) + ' KB',
                date: stats.mtime.toISOString().split('T')[0]
            };
        });
        res.json(fileList);
    });
};

exports.downloadFile = (req, res) => {
    const userPath = getUserStoragePath(req);
    const fileName = req.params.file;
    const filePath = path.join(userPath, fileName);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
};

exports.deleteFile = (req, res) => {
    const userPath = getUserStoragePath(req);
    const fileName = req.params.file;
    const filePath = path.join(userPath, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send('File deleted');
    } else {
        res.status(404).send('File not found');
    }
};

exports.processAI = async (req, res) => {
    const { prompt, apiKey } = req.body;

    if (!apiKey) {
        return res.status(401).json({ response: "Missing API Key." });
    }

    // Validate key against database
    try {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        let foundUser = null;
        let foundKey = null;

        for (const user of users) {
            const key = user.apiKeys?.find(k => k.value === apiKey);
            if (key) {
                foundUser = user;
                foundKey = key;
                break;
            }
        }

        if (!foundKey) {
            return res.status(401).json({ response: "Access Denied: Invalid AI API Key." });
        }

        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3",
            prompt: prompt,
            stream: false
        });

        res.json({
            response: response.data.response,
            node: "NSCS-ALPHA-01",
            usedKey: foundKey.name
        });
    } catch (error) {
        console.error("AI Service Error:", error.message);
        res.status(500).json({ response: "AI Cluster Error: Backend service disconnected." });
    }
};
