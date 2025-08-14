import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Heart
} from "lucide-react";

export default function RequestStatus({ requests }) {
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

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          Request Status
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {requests && requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => {
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-100 text-red-800 font-mono">
                          {request.bloodType}
                        </Badge>
                        <Badge variant="secondary" className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {request.unitsNeeded} units needed • {request.hospital || 'Hospital not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    {request.created_date && (
                      <div>{new Date(request.created_date).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests</h3>
            <p className="text-gray-600">You haven't made any blood requests yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
