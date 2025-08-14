import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FindBlood from './pages/FindBlood';
import DonorDashboard from './pages/DonorDashboard';
import MyRequests from './pages/MyRequests';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FindBlood />} />
      <Route path="/find-blood" element={<FindBlood />} />
      <Route path="/donor-dashboard" element={<DonorDashboard />} />
      <Route path="/my-requests" element={<MyRequests />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<FindBlood />} />
    </Routes>
  );
}
