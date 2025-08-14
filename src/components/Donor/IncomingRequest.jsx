import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Clock, 
  MapPin, 
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IncomingRequests({ matches, onResponse }) {
  const getUrgencyColor = (urgency) => {
    const colors = {
      routine: "bg-blue-100 text-blue-800",
      urgent: "bg-amber-100 text-amber-800", 
      emergency: "bg-red-100 text-red-800"
    };
    return colors[urgency] || colors.routine;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Incoming Requests
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {matches.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">
              When patients in your area need your blood type, requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Blood Request</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-red-100 text-red-800 font-mono">
                            O+ Blood Needed
                          </Badge>
                          <Badge variant="secondary" className={getUrgencyColor("urgent")}>
                            Urgent
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-600 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>5 minutes ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Patient: Emergency Request</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Distance: {(match.distance / 1000).toFixed(1)} km</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Units needed: 2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Hospital: Dhaka Medical</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 mb-4">
                    <p className="text-gray-700 text-sm">
                      "Patient needs urgent blood transfusion. Surgery scheduled for today evening. 
                      Please contact immediately if available."
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => onResponse(match.id, "accepted")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept & Help
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => onResponse(match.id, "declined")}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Countdown timer */}
                  <div className="mt-3 text-center">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Expires in 8 minutes
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
