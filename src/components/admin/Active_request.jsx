import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Clock, 
  MapPin, 
  Heart,
  Phone,
  User,
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActiveRequests({ requests, matches, loading }) {
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-800",
      matched: "bg-green-100 text-green-800",
      fulfilled: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.open;
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      routine: "bg-blue-100 text-blue-800",
      urgent: "bg-amber-100 text-amber-800",
      emergency: "bg-red-100 text-red-800"
    };
    return colors[urgency] || colors.routine;
  };

  const getTimeElapsed = (createdDate) => {
    const now = new Date();
    const created = new Date(createdDate);
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Active Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeRequests = requests.filter(r => r.status === 'open' || r.status === 'matched');

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Active Blood Requests
          </CardTitle>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {activeRequests.length} active
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {activeRequests.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Requests</h3>
            <p className="text-gray-600">All current blood requests have been fulfilled or closed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <Card key={request.id} className="border-2 border-gray-100 hover:border-red-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.requesterName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-red-100 text-red-800 font-mono">
                            {request.bloodType}
                          </Badge>
                          <Badge variant="secondary" className={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                          <Badge variant="secondary" className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeElapsed(request.created_date)}</span>
                      </div>
                      {request.urgency === 'emergency' && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Critical
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{request.requesterPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">Units needed: {request.unitsNeeded}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          {request.hospital || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          Search radius: {request.radiusMeters / 1000}km
                        </span>
                      </div>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-gray-700 text-sm">"{request.notes}"</p>
                    </div>
                  )}

                  {/* Match Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      {request.status === 'matched' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Donor matched</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Searching for donors...</span>
                        </div>
                      )}
                      
                      <span className="text-gray-500">
                        {matches.filter(m => m.requestId === request.id).length} donors notified
                      </span>
                    </div>

                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}