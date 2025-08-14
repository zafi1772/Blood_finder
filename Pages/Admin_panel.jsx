import React, { useState, useEffect } from "react";
import { Donor, ReceiverRequest, Match } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Activity, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  MapPin,
  TrendingUp
} from "lucide-react";

import DonorVerification from "../components/admin/DonorVerification";
import SystemStats from "../components/admin/SystemStats";
import ActiveRequests from "../components/admin/ActiveRequests";

export default function AdminPanelPage() {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonors: 0,
    verifiedDonors: 0,
    availableDonors: 0,
    activeRequests: 0,
    totalMatches: 0,
    successRate: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [donorsData, requestsData, matchesData] = await Promise.all([
        Donor.list(),
        ReceiverRequest.list(),
        Match.list()
      ]);

      setDonors(donorsData);
      setRequests(requestsData);
      setMatches(matchesData);

      // Calculate stats
      const verifiedCount = donorsData.filter(d => d.verified).length;
      const availableCount = donorsData.filter(d => d.availability).length;
      const activeCount = requestsData.filter(r => r.status === 'open').length;
      const successfulMatches = matchesData.filter(m => m.status === 'accepted').length;
      
      setStats({
        totalDonors: donorsData.length,
        verifiedDonors: verifiedCount,
        availableDonors: availableCount,
        activeRequests: activeCount,
        totalMatches: matchesData.length,
        successRate: matchesData.length > 0 ? Math.round((successfulMatches / matchesData.length) * 100) : 0
      });

    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setLoading(false);
  };

  const handleDonorVerification = async (donorId, verified) => {
    try {
      await Donor.update(donorId, { verified });
      loadData(); // Reload data
    } catch (error) {
      console.error("Error updating donor verification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">System management and donor verification</p>
          </div>
        </div>

        {/* System Stats */}
        <SystemStats stats={stats} loading={loading} />

        {/* Main Content */}
        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Donor Verification
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Active Requests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <DonorVerification 
              donors={donors}
              onVerify={handleDonorVerification}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="requests">
            <ActiveRequests 
              requests={requests}
              matches={matches}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600">
                      Detailed analytics and reporting features will be implemented here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}