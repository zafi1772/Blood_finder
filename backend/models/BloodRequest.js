const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor is required']
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      message: 'Blood type must be one of: A+, A-, B+, B-, O+, O-, AB+, AB-'
    }
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },
  requesterLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  requesterContact: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  distance: {
    type: Number, // Distance in meters
    required: false
  },
  estimatedTime: {
    type: String, // e.g., "15 mins", "2 hours"
    required: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  }
}, {
  timestamps: true
});

// Index for faster queries
bloodRequestSchema.index({ donor: 1 });
bloodRequestSchema.index({ requester: 1 });
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ bloodType: 1 });
bloodRequestSchema.index({ createdAt: -1 });
bloodRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired requests

// Create 2dsphere index on requester location for geospatial queries
bloodRequestSchema.index({ requesterLocation: '2dsphere' });

// Virtual for calculating age of request
bloodRequestSchema.virtual('requestAge').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffMs = now - created;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins}m ago`;
  }
  return `${diffMins}m ago`;
});

// Ensure virtual fields are serialized
bloodRequestSchema.set('toJSON', { virtuals: true });
bloodRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema); 