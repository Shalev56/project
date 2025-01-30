const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const cakeRoutes = require('./routes/cakeRoutes');
const {confsecretList} = require('../config/secret.js');

const app = express();

// Middleware
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', authRoutes);
app.use('/api', cakeRoutes);

// MongoDB Connection
mongoose.connect(`mongodb+srv://${confsecretList.USERNAME}:${confsecretList.PASSWORD}@cluster0.ls0l2.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error', err);
});

module.exports = app;
