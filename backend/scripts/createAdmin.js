const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodfinder');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bloodfinder.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@bloodfinder.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      phone: '+1234567890',
      isVerified: true,
      isActive: true,
      permissions: [
        'users.read',
        'users.write',
        'users.delete',
        'requests.read',
        'requests.write',
        'analytics.read',
        'system.read',
        'admin.create'
      ]
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@bloodfinder.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin(); 