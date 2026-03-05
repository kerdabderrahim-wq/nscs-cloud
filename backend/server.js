require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure storage and database folders exist (one level up as per requested structure)
const storagePath = path.join(__dirname, '..', 'storage');
const dbPath = path.join(__dirname, '..', 'database');

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

// Routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`NSCS-CLOUD Backend running on http://localhost:${PORT}`);
});
