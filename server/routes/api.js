// routes/api.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import your authentication middleware
const UserDetails = require('../models/userDetails');

// Endpoint to fetch user details based on the token
router.get('/user-details', authMiddleware, async (req, res) => {
  try {
    // Access the user object from the request
    const user = req.user;

    // Find user details based on the user's email
    const userDetails = await UserDetails.find({ email: user.email });

    res.json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
