const express = require('express');
const Donor = require('../models/Donor');
const router = express.Router();

// POST /api/donors/update-location
router.post('/update-location', async (req, res) => {
  try {
    const { name, email, bloodType, longitude, latitude } = req.body;

    // Validate required fields
    if (!name || !email || !bloodType || longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, bloodType, longitude, latitude'
      });
    }

    // Validate coordinates
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90'
      });
    }

    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood type. Must be one of: ${validBloodTypes.join(', ')}`
      });
    }

    // Upsert donor
    const donor = await Donor.findOneAndUpdate(
      { email },
      {
        name,
        email,
        bloodType,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        availability: true,
        updatedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Donor location updated successfully',
      data: donor
    });

  } catch (error) {
    console.error('Error updating donor location:', error);
    
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
        message: 'Email already exists with different data'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/donors/nearby
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, bloodType, maxDistance = 5000 } = req.query;

    // Validate required parameters
    if (!lat || !lng || !bloodType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: lat, lng, bloodType'
      });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distance = parseInt(maxDistance);

    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180'
      });
    }

    if (isNaN(distance) || distance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maxDistance. Must be a positive number'
      });
    }

    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood type. Must be one of: ${validBloodTypes.join(', ')}`
      });
    }

    // Find nearby donors using geospatial query
    const donors = await Donor.find({
      bloodType,
      availability: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance
        }
      }
    })
    .select('name email bloodType availability location updatedAt')
    .limit(10)
    .lean();

    // Calculate distances for response
    const donorsWithDistance = donors.map(donor => {
      const donorLng = donor.location.coordinates[0];
      const donorLat = donor.location.coordinates[1];
      
      // Haversine formula for distance calculation
      const R = 6371000; // Earth's radius in meters
      const φ1 = latitude * Math.PI / 180;
      const φ2 = donorLat * Math.PI / 180;
      const Δφ = (donorLat - latitude) * Math.PI / 180;
      const Δλ = (donorLng - longitude) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return {
        ...donor,
        distance: Math.round(distance)
      };
    });

    res.status(200).json({
      success: true,
      count: donorsWithDistance.length,
      data: donorsWithDistance
    });

  } catch (error) {
    console.error('Error finding nearby donors:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 