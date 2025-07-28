# 🩸 BloodFinder - Blood Donation Platform

A modern, location-aware blood donation platform that connects donors and receivers in real-time.

## 🚀 Features

- **Role-Based System**: Separate interfaces for donors, receivers, and admins
- **Real-Time Location Search**: Find nearby blood donors using geospatial queries
- **Interactive Maps**: Leaflet integration with OpenStreetMap (no API keys needed)
- **Modern UI**: Beautiful, responsive design with animations
- **Admin Panel**: Comprehensive dashboard for system management
- **Authentication**: Secure login/registration with JWT tokens
- **Notifications**: Real-time blood request notifications for donors

## 📁 Project Structure

```
BloodFinder/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── DonorSearch.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── LeafletMap.tsx
│   │   │   └── AdminPanel.tsx
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── backend/                  # Node.js Express backend
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Donor.js
│   │   └── BloodRequest.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── donors.js
│   │   ├── requests.js
│   │   └── admin.js
│   ├── scripts/             # Utility scripts
│   │   └── createAdmin.js
│   ├── server.js
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router DOM** for routing
- **Styled Components** for styling
- **Lucide React** for icons
- **Leaflet** + **React-Leaflet** for maps
- **OpenStreetMap** for map tiles

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **GeoJSON** for location data
- **2dsphere indexes** for geospatial queries

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd BloodFinder
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB URI
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Create Admin User
```bash
cd backend
node scripts/createAdmin.js
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/bloodfinder
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## 📱 User Roles

### 🩸 Donors
- Register with blood type
- Set availability status
- Receive blood request notifications
- View request details and contact info

### 🔍 Receivers
- Search for nearby donors
- Send blood requests
- View donor locations on map
- Get directions to donors

### 👑 Admins
- Manage all users
- View system analytics
- Monitor blood requests
- System configuration

## 🗺️ Map Integration

- **Leaflet Maps**: Free, open-source mapping
- **OpenStreetMap**: No API keys required
- **Geocoding**: Nominatim for address lookup
- **Directions**: Direct links to OpenStreetMap directions

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Donors
- `POST /api/donors/update-location` - Update donor location
- `GET /api/donors/nearby` - Find nearby donors

### Requests
- `POST /api/requests/send` - Send blood request
- `GET /api/requests/donor` - Get donor's requests
- `GET /api/requests/receiver` - Get receiver's requests
- `PUT /api/requests/:id/status` - Update request status

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/requests` - Get all requests
- `GET /api/admin/analytics` - Get system analytics

## 🎨 UI Features

- **Dark Blue Theme**: Modern, professional design
- **Responsive Layout**: Works on all devices
- **Smooth Animations**: Uber-style search animations
- **Role-Based Interface**: Different UI for each user type
- **Interactive Maps**: Real-time location visualization

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
cd backend
npm run build
# Deploy to your platform
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy to your platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Made with ❤️ for saving lives through blood donation** 