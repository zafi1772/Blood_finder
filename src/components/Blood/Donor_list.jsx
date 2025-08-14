import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  Phone, 
  Clock, 
  Navigation,
  Shield,
  MessageCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function DonorList({ donors, loading, userLocation }) {
  const calculateDistance = (donor) => {
    if (!donor.location?.coordinates || !userLocation) return 0;
    
    const [donorLng, donorLat] = donor.location.coordinates;
    const { lat: userLat, lng: userLng } = userLocation;
    
    const dLat = (donorLat - userLat) * Math.PI / 180;
    const dLng = (donorLng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(donorLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return 6371 * c * 1000; // Distance in meters
  };

  const sortedDonors = donors
    .map(donor => ({ ...donor, distance: calculateDistance(donor) }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Available Donors
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {donors.length} nearby
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        ) : sortedDonors.length > 0 ? (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {sortedDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                        {donor.verified && (
                          <Shield className="w-4 h-4 text-green-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
                        )}
                      </div>

                      {/* Donor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className="bg-red-100 text-red-800 font-mono font-bold text-sm"
                          >
                            {donor.bloodType}
                          </Badge>
                          {donor.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Navigation className="w-3 h-3" />
                            <span className="font-medium">
                              {(donor.distance / 1000).toFixed(1)} km away
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>Available now</span>
                          </div>

                          {donor.lastDonationDate && (
                            <div className="flex items-center gap-2">
                              <Heart className="w-3 h-3" />
                              <span>
                                Last donated: {new Date(donor.lastDonationDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Response time: ~5 minutes</span>
                      <span>Success rate: 95%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Donors</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              There are currently no available donors in your area. 
              Try expanding your search radius or check back in a few minutes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
