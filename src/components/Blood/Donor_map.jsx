import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Heart, 
  Navigation,
  Users
} from "lucide-react";

export default function DonorMap({ donors, userLocation }) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Donor Map
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
          <p className="text-gray-600 mb-4">
            Map showing nearby donors and their locations
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{donors?.length || 0} donors in your area</span>
          </div>
        </div>
        
        {userLocation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Navigation className="w-4 h-4" />
              <span>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
