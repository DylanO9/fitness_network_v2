const express = require('express');
const router = express.Router();
const pool = require('../db');

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
router.post('/', async (req, res) => {
  const { username, password, email, first_name, last_name, phone_number } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Users (username, password, email, first_name, last_name, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [username, password, email, first_name, last_name, phone_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
