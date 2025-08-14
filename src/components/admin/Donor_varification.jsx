import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Heart,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DonorVerification({ donors, onVerify, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "verified" && donor.verified) ||
                         (filter === "pending" && !donor.verified);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Donor Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Donor Verification
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {donors.filter(d => !d.verified).length} pending
          </Badge>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search donors by name, email, or blood type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {["all", "pending", "verified"].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className={filter === filterType ? "bg-blue-600" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredDonors.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donors Found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No donors in the system yet"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredDonors.map((donor) => (
              <div key={donor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      {donor.verified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Donor Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                        <Badge 
                          variant="secondary" 
                          className="bg-red-100 text-red-800 font-mono text-sm"
                        >
                          {donor.bloodType}
                        </Badge>
                        <Badge 
                          variant={donor.verified ? "default" : "secondary"}
                          className={donor.verified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                          }
                        >
                          {donor.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{donor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{donor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>
                            Joined: {new Date(donor.created_date).toLocaleDateString()}
                          </span>
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

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {!donor.verified ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onVerify(donor.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onVerify(donor.id, false)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onVerify(donor.id, false)}
                          className="border-amber-200 text-amber-600 hover:bg-amber-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Status: {donor.availability ? "Available" : "Not Available"}
                    </span>
                    <span>
                      Role: {donor.role || "Donor"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}