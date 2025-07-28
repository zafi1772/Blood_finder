# BloodFinder Backend API

REST API for Blood Matching web application built with Node.js, Express, and MongoDB.

## Features

- **Donor Management**: Register and update donor information
- **Geospatial Search**: Find nearby donors based on location and blood type
- **Real-time Updates**: Track donor availability and location
- **Production Ready**: Security, logging, error handling, and CORS

## Tech Stack

- **Runtime**: Node.js (>=16.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/bloodfinder
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or use MongoDB Atlas.

### 4. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns server status and uptime.

### Update Donor Location

```http
POST /api/donors/update-location
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "bloodType": "A+",
  "longitude": -74.006,
  "latitude": 40.7128
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donor location updated successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "bloodType": "A+",
    "availability": true,
    "location": {
      "type": "Point",
      "coordinates": [-74.006, 40.7128]
    },
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Find Nearby Donors

```http
GET /api/donors/nearby?lat=40.7128&lng=-74.006&bloodType=A+&maxDistance=5000
```

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude  
- `bloodType` (required): Blood type (A+, A-, B+, B-, O+, O-, AB+, AB-)
- `maxDistance` (optional): Maximum distance in meters (default: 5000)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "bloodType": "A+",
      "availability": true,
      "location": {
        "type": "Point",
        "coordinates": [-74.005, 40.7130]
      },
      "distance": 245,
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Data Models

### Donor Schema

```javascript
{
  name: String (required, max 100 chars),
  email: String (required, unique, validated),
  bloodType: String (required, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-']),
  availability: Boolean (default: true),
  location: {
    type: 'Point',
    coordinates: [longitude, latitude] // GeoJSON format
  },
  updatedAt: Date (default: now),
  createdAt: Date (auto-generated),
}
```

## Database Indexes

- **2dsphere index** on `location` for geospatial queries
- **Compound index** on `bloodType`, `availability`, `updatedAt` for efficient filtering

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors, missing parameters)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure

```
backend/
├── models/
│   └── Donor.js          # Mongoose schema
├── routes/
│   └── donors.js         # API routes
├── server.js             # Express app setup
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # Documentation
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up process management (PM2, Docker, etc.)
5. Enable HTTPS
6. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 