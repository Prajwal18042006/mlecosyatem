require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database connection (Optional placeholder)
// const connectDB = require('./config/database');
// connectDB();

// Basic API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Handle API 404s
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Serve the main entry point for all other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
