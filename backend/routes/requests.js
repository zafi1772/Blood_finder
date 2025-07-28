const express = require('express');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const router = express.Router();

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// POST /api/requests/send - Send blood request to donor
router.post('/send', authenticateUser, async (req, res) => {
  try {
    const { 
      donorId, 
      bloodType, 
      urgency, 
      message, 
      requesterLocation, 
      requesterContact,
      distance,
      estimatedTime 
    } = req.body;

    // Validate required fields
    if (!donorId || !bloodType || !requesterLocation || !requesterContact) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: donorId, bloodType, requesterLocation, requesterContact'
      });
    }

    // Validate requester is not a donor
    if (req.user.role !== 'receiver') {
      return res.status(400).json({
        success: false,
        message: 'Only receivers can send blood requests'
      });
    }

    // Validate donor exists and is active
    const donor = await User.findById(donorId);
    if (!donor || donor.role !== 'donor' || !donor.isActive || !donor.availability) {
      return res.status(400).json({
        success: false,
        message: 'Donor not found or not available'
      });
    }

    // Validate blood type compatibility
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood type. Must be one of: ${validBloodTypes.join(', ')}`
      });
    }

    // Check if there's already a pending request to this donor
    const existingRequest = await BloodRequest.findOne({
      requester: req.user._id,
      donor: donorId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request to this donor'
      });
    }

    // Create blood request
    const bloodRequest = new BloodRequest({
      requester: req.user._id,
      donor: donorId,
      bloodType,
      urgency: urgency || 'medium',
      message: message || '',
      requesterLocation: {
        type: 'Point',
        coordinates: [requesterLocation.longitude, requesterLocation.latitude],
        address: requesterLocation.address
      },
      requesterContact: {
        phone: requesterContact.phone || req.user.phone,
        email: requesterContact.email || req.user.email,
        name: requesterContact.name || req.user.name
      },
      distance: distance || null,
      estimatedTime: estimatedTime || null
    });

    await bloodRequest.save();

    // Populate the request with donor details
    await bloodRequest.populate('donor', 'name email phone');
    await bloodRequest.populate('requester', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Blood request sent successfully',
      data: bloodRequest
    });

  } catch (error) {
    console.error('Send request error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/requests/donor - Get all requests for the authenticated donor
router.get('/donor', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(400).json({
        success: false,
        message: 'Only donors can view their requests'
      });
    }

    const { status = 'pending', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { donor: req.user._id };
    if (status !== 'all') {
      query.status = status;
    }

    // Get requests with pagination
    const requests = await BloodRequest.find(query)
      .populate('requester', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get donor requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/requests/receiver - Get all requests sent by the authenticated receiver
router.get('/receiver', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'receiver') {
      return res.status(400).json({
        success: false,
        message: 'Only receivers can view their sent requests'
      });
    }

    const { status = 'all', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { requester: req.user._id };
    if (status !== 'all') {
      query.status = status;
    }

    // Get requests with pagination
    const requests = await BloodRequest.find(query)
      .populate('donor', 'name email phone bloodType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get receiver requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/requests/:requestId/status - Update request status (accept/reject/complete)
router.put('/:requestId/status', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, message } = req.body;

    // Validate status
    const validStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find the request
    const request = await BloodRequest.findById(requestId)
      .populate('donor', 'name email phone')
      .populate('requester', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check authorization
    const isDonor = req.user._id.toString() === request.donor._id.toString();
    const isRequester = req.user._id.toString() === request.requester._id.toString();

    if (!isDonor && !isRequester) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request'
      });
    }

    // Validate status change permissions
    if ((status === 'accepted' || status === 'rejected') && !isDonor) {
      return res.status(403).json({
        success: false,
        message: 'Only donors can accept or reject requests'
      });
    }

    if (status === 'cancelled' && !isRequester) {
      return res.status(403).json({
        success: false,
        message: 'Only requesters can cancel requests'
      });
    }

    // Update request
    request.status = status;
    if (message) {
      request.message = message;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: request
    });

  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/requests/nearby - Find nearby blood requests (for donors)
router.get('/nearby', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(400).json({
        success: false,
        message: 'Only donors can view nearby requests'
      });
    }

    const { 
      lat, 
      lng, 
      maxDistance = 10000, // 10km default
      bloodType,
      urgency,
      page = 1,
      limit = 10 
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const skip = (page - 1) * limit;

    // Build query
    const query = {
      status: 'pending',
      requesterLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    };

    if (bloodType) {
      query.bloodType = bloodType;
    }

    if (urgency) {
      query.urgency = urgency;
    }

    // Get nearby requests
    const requests = await BloodRequest.find(query)
      .populate('requester', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get nearby requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 