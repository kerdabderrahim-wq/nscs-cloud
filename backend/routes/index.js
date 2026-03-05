const express = require('express');
const router = express.Router();
const controller = require('../controllers/cloudController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Config for Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.headers['x-user-email'] || 'public';
        console.log(`Upload request from: ${userEmail}`);
        const userPath = path.join(__dirname, '../../storage', userEmail);
        if (!fs.existsSync(userPath)) {
            fs.mkdirSync(userPath, { recursive: true });
        }
        cb(null, userPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const authController = require('../controllers/authController');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// API Key Management
router.get('/keys', authController.getKeys);
router.post('/keys', authController.createKey);
router.delete('/keys/:id', authController.deleteKey);

// File Routes
router.post('/upload', upload.single('file'), controller.uploadFile);
router.get('/files', controller.getFiles);
router.get('/download/:file', controller.downloadFile);
router.delete('/delete/:file', controller.deleteFile);

// AI Route
router.post('/ai', controller.processAI);

module.exports = router;
