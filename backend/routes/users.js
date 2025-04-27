const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt'); // Assuming you use bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // Assuming you use JWT for authentication

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new user
router.post('/signup', async (req, res) => {
    const { username, password, email, first_name, last_name, phone_number } = req.body;
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert the new user into the database
        const result = await pool.query(
            `INSERT INTO Users (username, password, email, first_name, last_name, phone_number)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, username, email, first_name, last_name, phone_number`,
            [username, hashedPassword, email, first_name, last_name, phone_number]
        );
        
        // Create JWT token
        const token = jwt.sign(
            { user_id: result.rows[0].user_id, username: result.rows[0].username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return user data and token
        res.status(201).json({
            user: result.rows[0],
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user by username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const user = result.rows[0];
        
        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return user data and token
        res.json({
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
