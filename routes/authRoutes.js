const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth.js');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, password: await User.prototype.encryptPassword(password) });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt:', { username, password });

        // Check if username exists in the database
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If the password matches, generate a JWT token
        console.log('Generating token for user:', user._id);
        const token = jwt.sign(
            { userId: user._id }, // Payload
            process.env.JWT_SECRET_KEY, // Secret key
            { expiresIn: '1h' } // Token expiration time
        );

        console.log('Token generated:', token);

        // Send the token back in the response
        res.json({ token });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Error logging in' });
    }
});


module.exports = router;