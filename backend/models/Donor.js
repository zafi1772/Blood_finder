const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      message: 'Blood type must be one of: A+, A-, B+, B-, O+, O-, AB+, AB-'
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coordinates) {
          return coordinates.length === 2 &&
                 coordinates[0] >= -180 && coordinates[0] <= 180 &&
                 coordinates[1] >= -90 && coordinates[1] <= 90;
        },
        message: 'Coordinates must be [longitude, latitude] with valid ranges'
      }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create 2dsphere index on location for geospatial queries
donorSchema.index({ location: '2dsphere' });

// Create compound index for efficient queries
donorSchema.index({ bloodType: 1, availability: 1, updatedAt: -1 });

// Pre-save middleware to update updatedAt
donorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-findOneAndUpdate middleware to update updatedAt
donorSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Donor', donorSchema); 