import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Plus,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function RequestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    bloodType: 'A+',
    unitsNeeded: 1,
    urgency: 'routine',
    hospital: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          Request Blood
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type Required
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units Needed
              </label>
              <input
                type="number"
                name="unitsNeeded"
                min="1"
                max="10"
                value={formData.unitsNeeded}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="flex gap-2">
              {['routine', 'urgent', 'emergency'].map(level => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleChange}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital/Medical Facility
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="Enter hospital name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional information or urgency details..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Submit Blood Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
