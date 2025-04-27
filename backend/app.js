const express = require('express');
const app = express();
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
// ... other route files

// Use routes
app.use('/api/users', userRoutes);
// ... other routes

module.exports = app;
