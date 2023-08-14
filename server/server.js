// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5500;
const jwt = require('jsonwebtoken'); // Import JWT library
const bcrypt = require('bcrypt');
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const payRouter = require('./routes/pay');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

app.get('/api/all-user-details', async (req, res) => {
  try {
    const allUserDetails = await UserDetails.find();
    res.status(200).json(allUserDetails);
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const User = require('./models/user'); // Create a User model using mongoose
const UserDetails = require('./models/userDetails');
const user = require('./models/user');
app.post('/api/register', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { firstName, lastName, email, password } = req.body;

    // Backend validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Backend validation: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    // Create and sign a JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Backend validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user with the given email exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Validate password using bcrypt's compare function
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create and sign a JWT token for the authenticated user
    const tokenPayload = {
      userId: existingUser._id,
      firstName: existingUser.firstName, // Add first name to the token payload
      lastName: existingUser.lastName, // Add last name to the token payload
    };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '7d' });

    // Successful login
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/profile', jwtMiddleware, async (req, res) => {
  try {
    const { email } = req.body
    await user.findOne({ email }, { password: 0 })
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send(err);
      });
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

// app.get('/api/user-details-by-email', jwtMiddleware, async (req, res) => {
//   try {
//     const email = req.user.email; // Get the email from the decoded token

//     const userDetails = await UserDetails.find({ email: 'johndoe@example.com' });

//     res.status(200).json(userDetails);
//   } catch (error) {
//     console.error('Error fetching user details by email:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

app.get('/api/user-details-by-email', jwtMiddleware, async (req, res) => {
  try {
    userEmail = req.headers['user-email']; // Get the email from the decoded token
    console.log(userEmail)
    const userDetails = await UserDetails.findOne({ email: userEmail });
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

// Combine the POST and GET route handlers for /api/user-details
app.route('/api/user-details')
  .post(async (req, res) => {
    try {
      const { name, email, address, phoneno, selectedDate, functionName, message, userId, description } = req.body;

      // Validate user details
      if (!name || !email || !address || !phoneno || !selectedDate || !functionName || !description) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user with the given userId already exists
      // const existingUserDetails = await UserDetails.findOne({ userId });
      // if (existingUserDetails) {
      //   return res.status(400).json({ message: 'User details already exist' });
      // }

      // Create a new user details entry
      const userDetails = new UserDetails({
        // userId,
        name,
        email,
        address,
        phoneno,
        selectedDate,
        functionName,
        message,
        description,
        userId, // You need to provide the user ID
      });

      await userDetails.save();

      res.status(201).json({ message: 'User details added successfully' });
    } catch (error) {
      console.error('Error adding user details:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  })
  .get(jwtMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId, 'firstName lastName email');
      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.use('/api/pay', payRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
