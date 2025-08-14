import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Phone, 
  Mail, 
  Heart, 
  Calendar,
  Edit3,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function DonorProfile({ donor, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: donor?.name || "",
    phone: donor?.phone || "",
    email: donor?.email || "",
    bloodType: donor?.bloodType || "",
    lastDonationDate: donor?.lastDonationDate || ""
  });

  const handleSave = async () => {
    // In production, update donor profile
    console.log("Saving profile:", editData);
    setIsEditing(false);
    if (onUpdate) onUpdate();
  };

  const handleCancel = () => {
    setEditData({
      name: donor?.name || "",
      phone: donor?.phone || "",
      email: donor?.email || "",
      bloodType: donor?.bloodType || "",
      lastDonationDate: donor?.lastDonationDate || ""
    });
    setIsEditing(false);
  };

  if (!donor) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Found</h3>
          <p className="text-gray-600 mb-4">Create your donor profile to get started</p>
          <Button className="bg-red-600 hover:bg-red-700">
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            Donor Profile
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="border-gray-200"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Blood Type</Label>
                  <Select value={editData.bloodType} onValueChange={(value) => setEditData({...editData, bloodType: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="font-mono font-bold">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-last-donation">Last Donation Date</Label>
                  <Input
                    id="edit-last-donation"
                    type="date"
                    value={editData.lastDonationDate}
                    onChange={(e) => setEditData({...editData, lastDonationDate: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{donor.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono font-bold text-red-600 text-lg">{donor.bloodType}</span>
                    {donor.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{donor.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{donor.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Type</p>
                      <p className="font-mono font-bold text-lg text-red-600">{donor.bloodType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Donation</p>
                      <p className="font-medium text-gray-900">
                        {donor.lastDonationDate 
                          ? new Date(donor.lastDonationDate).toLocaleDateString()
                          : "Never donated"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Eligible to Donate</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  You can donate blood. Remember to wait at least 56 days between donations.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
