// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); 

// router.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = new User({ email, password });
//     await user.save();
//     res.json({ success: true });
//   } catch (error) {
//     console.error('An error occurred during registration:', error);
//     res.status(500).json({ success: false, message: 'Registration failed' });
//   }
// });

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (user) {
//       res.json({ success: true });
//     } else {
//       res.json({ success: false, message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('An error occurred during login:', error);
//     res.status(500).json({ success: false, message: 'Login failed' });
//   }
// });

// router.post('/submit-details', async (req, res) => {
//   try {
//     const { email, firstName, lastName, age, location, mobileNo } = req.body;
//     const user = await User.findOne({ email });
//     if (user) {
//       user.firstName = firstName;
//       user.lastName = lastName;
//       user.age = age;
//       user.location = location;
//       user.mobileNo = mobileNo;
//       await user.save();
//       res.json({ success: true });
//     } else {
//       res.json({ success: false, message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('An error occurred during details submission:', error);
//     res.status(500).json({ success: false, message: 'Details submission failed' });
//   }
// });

// module.exports = router;
