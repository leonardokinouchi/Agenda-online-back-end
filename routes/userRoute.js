const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');


// User registration route
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({error: 'E-mail already in use'})
        }

        // Create a new user instance
        const newUser = new User({ username, password, email });

        // Save the user to the database (password is hashed automatically via pre('save') in the model)
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        // Handle errors
        res.status(400).json({ error: 'Registration failed', details: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

// Route to delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

module.exports = router;
