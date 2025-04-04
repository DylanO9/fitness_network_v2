const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone_number } = req.body;
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            first_name, 
            last_name, 
            phone_number 
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user by username
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password in database
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send token and user data (excluding password)
        const { password: _, ...userData } = user.toJSON();
        res.status(200).json({
            user: userData,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
};