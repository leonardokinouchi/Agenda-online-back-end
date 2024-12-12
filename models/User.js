const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Unique username
    password: { type: String, required: true }, // Encrypted password
    email: {
        type: String,
        required: false,
        unique: true, 
        validate: {
            validator: function (email) {
                // Regular expression to validate email format
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
            },
            message: 'Invalid email format'
        }
    },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); // Hash password
    next();
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
