import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DonorList from "@/components/Blood/Donor_list";
import DonorMap from "@/components/Blood/Donor_map";
import RequestForm from "@/components/Blood/RequestForm";
import RequestStatus from "@/components/Blood/RequestStatus";
import { Donor, ReceiverRequest } from "@/entities/all";

export default function FindBlood() {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadData();
    getCurrentLocation();
  }, []);

  const loadData = async () => {
    try {
      const [donorsData, requestsData] = await Promise.all([
        Donor.all(),
        ReceiverRequest.filter({ requesterId: "current-user-id" })
      ]);
      setDonors(donorsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleRequestSubmit = async (formData) => {
    try {
      // In production, this would create a new request
      console.log("New blood request:", formData);
      // Reload requests after submission
      await loadData();
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <Layout currentPageName="FindBlood">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Blood Donors</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with nearby blood donors and request the blood type you need
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Request Form & Status */}
            <div className="lg:col-span-1 space-y-6">
              <RequestForm onSubmit={handleRequestSubmit} />
              <RequestStatus requests={requests} />
            </div>

            {/* Right Column - Donor List & Map */}
            <div className="lg:col-span-2 space-y-6">
              <DonorList 
                donors={donors} 
                loading={loading} 
                userLocation={userLocation} 
              />
              <DonorMap 
                donors={donors} 
                userLocation={userLocation} 
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
