const mongoose = require('mongoose');

// Define the schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Task title
    description: { type: String, required: false }, // Optional description
    dueDate: { type: Date, required: false }, // Optional due date
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    completed: { type: Boolean, default: false }, // Task completion status
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
