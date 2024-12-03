const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify with your secret
        req.user = decoded; // Attach decoded payload (e.g., user ID) to the request
        next(); // Pass control to the next middleware/route handler
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticate;
