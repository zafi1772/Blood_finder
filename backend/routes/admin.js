const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const mongoose = require('mongoose');

const router = express.Router();

// Middleware to authenticate admin users
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Check permission middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${permission} permission required.`
      });
    }
    next();
  };
};

// =============================================================================
// DASHBOARD ANALYTICS
// =============================================================================

// Get dashboard overview stats
router.get('/dashboard', authenticateAdmin, checkPermission('analytics.read'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalReceivers,
      totalRequests,
      pendingRequests,
      completedRequests,
      activeUsers,
      newUsersToday
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'receiver' }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: 'pending' }),
      BloodRequest.countDocuments({ status: 'completed' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    // Blood type distribution
    const bloodTypeStats = await User.aggregate([
      { $match: { role: 'donor', bloodType: { $exists: true } } },
      { $group: { _id: '$bloodType', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Monthly user registrations
    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          users: { $sum: 1 },
          donors: { $sum: { $cond: [{ $eq: ['$role', 'donor'] }, 1, 0] } },
          receivers: { $sum: { $cond: [{ $eq: ['$role', 'receiver'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Request status distribution
    const requestStats = await BloodRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDonors,
          totalReceivers,
          totalRequests,
          pendingRequests,
          completedRequests,
          activeUsers,
          newUsersToday
        },
        bloodTypeDistribution: bloodTypeStats,
        monthlyRegistrations: monthlyStats,
        requestStatusDistribution: requestStats
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// =============================================================================
// USER MANAGEMENT
// =============================================================================

// Get all users with pagination and filtering
router.get('/users', authenticateAdmin, checkPermission('users.read'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
    if (req.query.bloodType) filters.bloodType = req.query.bloodType;
    if (req.query.search) {
      filters.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filters)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get specific user details
router.get('/users/:userId', authenticateAdmin, checkPermission('users.read'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's request history
    const requests = await BloodRequest.find({
      $or: [{ requester: user._id }, { donor: user._id }]
    }).populate('requester donor', 'name email').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { user, requests }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details'
    });
  }
});

// Update user
router.put('/users/:userId', authenticateAdmin, checkPermission('users.write'), async (req, res) => {
  try {
    const { name, email, role, bloodType, phone, isActive, isVerified } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (bloodType) updateData.bloodType = bloodType;
    if (phone) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// Delete user
router.delete('/users/:userId', authenticateAdmin, checkPermission('users.delete'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - just deactivate
    if (req.query.hard === 'true') {
      await User.findByIdAndDelete(req.params.userId);
      // Also delete related blood requests
      await BloodRequest.deleteMany({
        $or: [{ requester: req.params.userId }, { donor: req.params.userId }]
      });
    } else {
      await User.findByIdAndUpdate(req.params.userId, { isActive: false });
    }

    res.json({
      success: true,
      message: req.query.hard === 'true' ? 'User permanently deleted' : 'User deactivated'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// =============================================================================
// BLOOD REQUEST MANAGEMENT
// =============================================================================

// Get all blood requests with pagination and filtering
router.get('/requests', authenticateAdmin, checkPermission('requests.read'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.bloodType) filters.bloodType = req.query.bloodType;
    if (req.query.urgency) filters.urgency = req.query.urgency;

    const [requests, total] = await Promise.all([
      BloodRequest.find(filters)
        .populate('requester', 'name email phone')
        .populate('donor', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BloodRequest.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests'
    });
  }
});

// Update request status
router.put('/requests/:requestId', authenticateAdmin, checkPermission('requests.write'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true, runValidators: true }
    ).populate('requester donor', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating request'
    });
  }
});

// =============================================================================
// SYSTEM MANAGEMENT
// =============================================================================

// Get system statistics
router.get('/system/stats', authenticateAdmin, checkPermission('system.read'), async (req, res) => {
  try {
    // Database statistics
    const dbStats = await mongoose.connection.db.stats();
    
    // Collection statistics
    const collections = await Promise.all([
      User.collection.stats(),
      BloodRequest.collection.stats()
    ]);

    // Server uptime
    const uptime = process.uptime();
    
    // Memory usage
    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        database: {
          collections: dbStats.collections,
          dataSize: dbStats.dataSize,
          indexSize: dbStats.indexSize,
          avgObjSize: dbStats.avgObjSize
        },
        server: {
          uptime: uptime,
          nodeVersion: process.version,
          platform: process.platform,
          memory: {
            rss: memoryUsage.rss,
            heapTotal: memoryUsage.heapTotal,
            heapUsed: memoryUsage.heapUsed,
            external: memoryUsage.external
          }
        },
        collections: {
          users: {
            count: collections[0].count,
            size: collections[0].size,
            avgObjSize: collections[0].avgObjSize
          },
          requests: {
            count: collections[1].count,
            size: collections[1].size,
            avgObjSize: collections[1].avgObjSize
          }
        }
      }
    });
  } catch (error) {
    console.error('System stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system statistics'
    });
  }
});

// Create admin user (super admin only)
router.post('/create-admin', authenticateAdmin, async (req, res) => {
  try {
    // Only allow if current user has super admin permissions
    if (!req.user.permissions.includes('admin.create')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create admin users'
      });
    }

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
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

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true,
      permissions: [
        'users.read',
        'users.write',
        'users.delete',
        'requests.read',
        'requests.write',
        'analytics.read',
        'system.read'
      ]
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user'
    });
  }
});

module.exports = router; 