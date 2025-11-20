const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  console.log('🔵 REGISTER ENDPOINT HIT');
  console.log('🔵 Request body:', req.body);
  
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      console.log('🔴 Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    console.log('🔵 Checking for existing user...');
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      console.log('🔴 User already exists:', { email, username });
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    console.log('🔵 Hashing password...');
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('🔵 Creating user in database...');
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    console.log('🔵 User created:', { id: user._id, username: user.username });
    
    console.log('🔵 Generating JWT token...');
    const token = generateToken(user._id);
    console.log('🟢 Token generated successfully');

    console.log('🟢 Registration successful, sending response');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('🔴 REGISTRATION ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  console.log('🔵 LOGIN ENDPOINT HIT');
  console.log('🔵 Request body:', req.body);
  
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      console.log('🔴 Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    console.log('🔵 Finding user by email:', email);
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('🔴 User not found with email:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('🔵 User found, checking password...');
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('🔴 Password does not match');
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('🔵 Password correct, updating online status...');
    // Update online status
    user.isOnline = true;
    await user.save();

    console.log('🔵 Generating JWT token...');
    const token = generateToken(user._id);
    console.log('🟢 Login successful, sending response');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline
        },
        token
      }
    });
  } catch (error) {
    console.error('🔴 LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  console.log('🔵 LOGOUT ENDPOINT HIT');
  console.log('🔵 User ID from token:', req.userId);
  
  try {
    const user = await User.findById(req.userId);
    if (user) {
      console.log('🔵 Updating user online status to false');
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
      console.log('🟢 User status updated successfully');
    } else {
      console.log('🔵 User not found for logout, but proceeding anyway');
    }

    console.log('🟢 Logout successful');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('🔴 LOGOUT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout
};