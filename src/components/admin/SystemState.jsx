import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Shield, 
  Heart, 
  Activity,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SystemStats({ stats, loading }) {
  const statCards = [
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12% this month"
    },
    {
      title: "Verified Donors", 
      value: stats.verifiedDonors,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: `${stats.totalDonors > 0 ? Math.round((stats.verifiedDonors / stats.totalDonors) * 100) : 0}% verified`
    },
    {
      title: "Available Now",
      value: stats.availableDonors,
      icon: Heart,
      color: "text-red-600", 
      bgColor: "bg-red-100",
      change: "24 active today"
    },
    {
      title: "Active Requests",
      value: stats.activeRequests,
      icon: Activity,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      change: "3 urgent cases"
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5% this week"
    },
    {
      title: "Avg Response",
      value: "4.2m",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100", 
      change: "15s faster"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="shadow-lg border-0 overflow-hidden relative">
          <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full opacity-20 transform translate-x-6 -translate-y-6`}></div>
          
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span>{stat.change}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}