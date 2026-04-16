const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./user/userRoutes');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.get('/', (req, res) => {
  res.send('W server!');
});

// User routes
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

