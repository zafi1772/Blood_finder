import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  Heart, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Phone,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReceiverRequest } from "@/entities/all";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRequests();
  }, []);

  const loadUserRequests = async () => {
    try {
      // In production, filter by current user ID
      const userRequests = await ReceiverRequest.filter({ 
        requesterId: "current-user-id" 
      });
      setRequests(userRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
    }
    setLoading(false);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      open: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        label: "Searching"
      },
      matched: {
        color: "bg-green-100 text-green-800", 
        icon: CheckCircle,
        label: "Matched"
      },
      fulfilled: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Fulfilled"
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Cancelled"
      }
    };
    return statusMap[status] || statusMap.open;
  };

  const getUrgencyInfo = (urgency) => {
    const urgencyMap = {
      routine: { color: "bg-blue-100 text-blue-800", icon: Clock },
      urgent: { color: "bg-amber-100 text-amber-800", icon: AlertTriangle },
      emergency: { color: "bg-red-100 text-red-800", icon: AlertTriangle }
    };
    return urgencyMap[urgency] || urgencyMap.routine;
  };

  const getTimeElapsed = (createdDate) => {
    const now = new Date();
    const created = new Date(createdDate);
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  const handleNewRequest = () => {
    // Navigate to FindBlood page to create new request
    window.location.href = '/find-blood';
  };

  return (
    <Layout currentPageName="MyRequests">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Blood Requests</h1>
                <p className="text-gray-600">Track all your blood donation requests</p>
              </div>
            </div>

            <Button className="bg-red-600 hover:bg-red-700" onClick={handleNewRequest}>
              <Plus className="w-5 h-5 mr-2" />
              New Request
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Requests", value: requests.length, color: "bg-blue-100 text-blue-800" },
              { label: "Active", value: requests.filter(r => r.status === 'open').length, color: "bg-amber-100 text-amber-800" },
              { label: "Fulfilled", value: requests.filter(r => r.status === 'fulfilled').length, color: "bg-green-100 text-green-800" },
              { label: "Success Rate", value: requests.length > 0 ? `${Math.round((requests.filter(r => r.status === 'fulfilled').length / requests.length) * 100)}%` : "0%", color: "bg-purple-100 text-purple-800" }
            ].map((stat, index) => (
              <Card key={stat.label} className="shadow-md border-0">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Requests List */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-48"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't made any blood requests. Create your first request to get started.
                  </p>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={handleNewRequest}>
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {requests.map((request, index) => {
                      const statusInfo = getStatusInfo(request.status);
                      const urgencyInfo = getUrgencyInfo(request.urgency);
                      const StatusIcon = statusInfo.icon;
                      const UrgencyIcon = urgencyInfo.icon;

                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-gray-100 hover:border-red-200 transition-all duration-200 cursor-pointer">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white fill-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                      {request.bloodType} Blood Request
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-red-100 text-red-800 font-mono">
                                        {request.bloodType}
                                      </Badge>
                                      <Badge variant="secondary" className={urgencyInfo.color}>
                                        <UrgencyIcon className="w-3 h-3 mr-1" />
                                        {request.urgency}
                                      </Badge>
                                      <Badge variant="secondary" className={statusInfo.color}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {statusInfo.label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Calendar className="w-3 h-3" />
                                    <span>{getTimeElapsed(request.created_date)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Units Needed</p>
                                  <p className="font-semibold text-gray-900">{request.unitsNeeded}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Hospital</p>
                                  <p className="font-semibold text-gray-900">
                                    {request.hospital || "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Search Radius</p>
                                  <p className="font-semibold text-gray-900">
                                    {request.radiusMeters / 1000} km
                                  </p>
                                </div>
                              </div>

                              {request.notes && (
                                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                                  <p className="text-gray-700 text-sm">"{request.notes}"</p>
                                </div>
                              )}

                              {/* Action based on status */}
                              {request.status === 'matched' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-600">
                                      <CheckCircle className="w-4 h-4" />
                                      <span className="font-medium">Donor matched! Check your phone for contact details.</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Donor
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Message
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {request.status === 'open' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-600">
                                      <Clock className="w-4 h-4 animate-pulse" />
                                      <span className="font-medium">Searching for nearby donors...</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                      Cancel Request
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {request.status === 'fulfilled' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">Request fulfilled successfully! Thank you for using Blood Finder.</span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
