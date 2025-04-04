const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const userRoutes = require('./src/routes/userRoutes');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fitness_network',
  password: '12345',
  port: 5432,
});

app.use('/users', userRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
