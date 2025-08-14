import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Shield,
  ToggleLeft,
  ToggleRight,
  Clock,
  Award
} from "lucide-react";

export default function DonorDashboard() {
  const [donorProfile, setDonorProfile] = useState({
    name: "John Doe",
    bloodType: "A+",
    phone: "+1 (555) 123-4567",
    email: "john.doe@email.com",
    location: "New York, NY",
    isAvailable: true,
    lastDonation: "2024-01-15",
    totalDonations: 12,
    verified: true
  });

  const [donationHistory] = useState([
    { date: "2024-01-15", units: 1, hospital: "City General Hospital", status: "Completed" },
    { date: "2023-10-20", units: 1, hospital: "Memorial Medical Center", status: "Completed" },
    { date: "2023-07-12", units: 1, hospital: "Community Health", status: "Completed" }
  ]);

  const toggleAvailability = () => {
    setDonorProfile(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const getDaysSinceLastDonation = () => {
    const lastDonation = new Date(donorProfile.lastDonation);
    const today = new Date();
    const diffTime = Math.abs(today - lastDonation);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const canDonate = getDaysSinceLastDonation() >= 56; // 8 weeks minimum

  return (
    <Layout currentPageName="DonorDashboard">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Donor Dashboard</h1>
              <p className="text-xl text-gray-600">Manage your donor profile and availability</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleAvailability}
              >
                {donorProfile.isAvailable ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-green-600" />
                    Available
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-gray-400" />
                    Unavailable
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-md border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{donorProfile.totalDonations}</p>
                <p className="text-sm text-gray-600">Total Donations</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{getDaysSinceLastDonation()}</p>
                <p className="text-sm text-gray-600">Days Since Last</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {canDonate ? "Ready" : "Wait"}
                </p>
                <p className="text-sm text-gray-600">Donation Status</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {donorProfile.verified ? "Verified" : "Pending"}
                </p>
                <p className="text-sm text-gray-600">Verification</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    Donor Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white fill-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{donorProfile.name}</h3>
                      <Badge className="bg-red-100 text-red-800 font-mono font-bold">
                        {donorProfile.bloodType}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{donorProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{donorProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{donorProfile.location}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Current Status</span>
                      <Badge 
                        variant="secondary" 
                        className={donorProfile.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {donorProfile.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {donorProfile.isAvailable ? (
                        <p>You are currently available to donate blood. People in need can see your profile.</p>
                      ) : (
                        <p>You are currently unavailable. Your profile will not be shown to people seeking donors.</p>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={toggleAvailability}
                    >
                      {donorProfile.isAvailable ? "Set Unavailable" : "Set Available"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Donation History */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Donation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {donationHistory.length > 0 ? (
                    <div className="space-y-4">
                      {donationHistory.map((donation, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {new Date(donation.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {donation.units} unit(s) • {donation.hospital}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="bg-green-100 text-green-800"
                          >
                            {donation.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donations Yet</h3>
                      <p className="text-gray-600">Your donation history will appear here after your first donation.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
