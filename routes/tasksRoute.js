const express = require('express');
const Task = require('../models/Task');
const authenticate = require('../middleware/authenticate'); // Middleware to verify JWT

const router = express.Router();

// GET all tasks for the logged-in user
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
    }
});

// GET a specific task by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task', details: error.message });
    }
});

// POST a new task
router.post('/', authenticate, async (req, res) => {
    const { title, description, dueDate } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            userId: req.user.id, // Attach the logged-in user's ID
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task', details: error.message });
    }
});

// PUT (update) a task by ID
router.put('/:id', authenticate, async (req, res) => {
    const { title, description, dueDate, completed } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, // Ensure the task belongs to the logged-in user
            { title, description, dueDate, completed },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task', details: error.message });
    }
});

// DELETE a task by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id, // Ensure the task belongs to the logged-in user
        });

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task', details: error.message });
    }
});

module.exports = router;
