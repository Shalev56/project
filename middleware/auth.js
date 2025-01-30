const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied, No Token Provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        
        // Attach user ID to request
        req.user = await User.findById(decoded.userId);
        next();
    });
};

module.exports = authenticateToken;
