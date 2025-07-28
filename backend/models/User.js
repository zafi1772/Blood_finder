const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['donor', 'receiver', 'admin'],
      message: 'Role must be donor, receiver, or admin'
    }
  },
  bloodType: {
    type: String,
    required: function() { return this.role === 'donor'; },
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      message: 'Blood type must be one of: A+, A-, B+, B-, O+, O-, AB+, AB-'
    }
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0] // [longitude, latitude]
    },
    address: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: {
    type: Boolean,
    default: function() { return this.role === 'donor'; }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Admin-specific fields
  permissions: {
    type: [String],
    default: function() {
      return this.role === 'admin' ? [
        'users.read',
        'users.write',
        'users.delete',
        'requests.read',
        'requests.write',
        'analytics.read',
        'system.read'
      ] : [];
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before updating
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Find user by email with password
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email }).select('+password');
};

// Check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.role === 'admin' && this.permissions.includes(permission);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 