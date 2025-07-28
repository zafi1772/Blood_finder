const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, bloodType, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, confirmPassword, and role'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate role
    if (!['donor', 'receiver'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either donor or receiver'
      });
    }

    // For donors, blood type is required
    if (role === 'donor' && !bloodType) {
      return res.status(400).json({
        success: false,
        message: 'Blood type is required for donors'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user data
    const userData = {
      name,
      email,
      password,
      role,
      phone: phone || undefined
    };

    // Add blood type for donors
    if (role === 'donor') {
      userData.bloodType = bloodType;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodType: user.bloodType,
      phone: user.phone,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and role'
      });
    }

    // Find user by email with password
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Invalid role. This account is registered as a ${user.role}`
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodType: user.bloodType,
      phone: user.phone,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/auth/me (Get current user profile)
router.get('/me', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Return user data
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodType: user.bloodType,
      phone: user.phone,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router; 