import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Calendar, 
  MapPin, 
  Heart,
  Award
} from "lucide-react";

export default function DonationHistory({ donorId }) {
  // Mock donation history
  const donations = [
    {
      id: 1,
      date: "2024-11-15",
      recipient: "Ahmed Hassan",
      hospital: "Square Hospital",
      units: 1,
      status: "completed"
    },
    {
      id: 2,
      date: "2024-09-20",
      recipient: "Fatima Khan", 
      hospital: "United Hospital",
      units: 2,
      status: "completed"
    },
    {
      id: 3,
      date: "2024-07-10",
      recipient: "Rashid Ahmed",
      hospital: "Dhaka Medical",
      units: 1,
      status: "completed"
    }
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-red-600" />
          Donation History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {donations.length === 0 ? (
          <div className="p-6 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No donations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {donations.map((donation) => (
              <div key={donation.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{donation.recipient}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(donation.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Heart className="w-3 h-3 mr-1" />
                    {donation.units} unit{donation.units > 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{donation.hospital}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {donations.length > 0 && (
          <div className="p-4 border-t bg-gradient-to-r from-red-50 to-red-100">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">
                {donations.length} Lives Saved!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
