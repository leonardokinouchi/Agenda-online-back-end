const express = require('express');
const router = express.Router();

// Add task
router.post('/', (req, res) => {
    const { taskName, userId } = req.body;
    res.send(`Task "${taskName}" added for user: ${userId}`);
});

// Get tasks
router.get('/', (req, res) => {
    res.send('Returning all tasks');
});

module.exports = router;
