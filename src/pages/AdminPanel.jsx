import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  Heart, 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  Settings,
  Eye
} from "lucide-react";

export default function AdminPanel() {
  const [systemStats, setSystemStats] = useState({
    totalDonors: 1247,
    activeDonors: 892,
    totalRequests: 456,
    activeRequests: 23,
    fulfilledRequests: 398,
    successRate: 87.3,
    totalLivesSaved: 1194
  });

  const [recentActivity, setRecentActivity] = useState([
    { type: 'donor_registered', message: 'New donor registered: Sarah Johnson (A+)', time: '2 minutes ago', status: 'success' },
    { type: 'request_fulfilled', message: 'Blood request fulfilled: B+ for City Hospital', time: '15 minutes ago', status: 'success' },
    { type: 'donor_verified', message: 'Donor verification completed: Mike Chen', time: '1 hour ago', status: 'info' },
    { type: 'emergency_request', message: 'Emergency request: O- blood needed urgently', time: '2 hours ago', status: 'warning' }
  ]);

  const [pendingActions, setPendingActions] = useState([
    { id: 1, type: 'donor_verification', donor: 'Alex Rodriguez', bloodType: 'AB+', priority: 'high' },
    { id: 2, type: 'system_alert', message: 'High demand for O- blood type', priority: 'medium' },
    { id: 3, type: 'donor_verification', donor: 'Lisa Wang', bloodType: 'B-', priority: 'normal' }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      info: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-amber-100 text-amber-800',
      normal: 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || colors.normal;
  };

  const handleAction = (actionId) => {
    // In production, this would handle the action
    console.log('Handling action:', actionId);
    setPendingActions(prev => prev.filter(action => action.id !== actionId));
  };

  return (
    <Layout currentPageName="AdminPanel">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
              <p className="text-xl text-gray-600">System management and analytics dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                System Settings
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Reports
              </Button>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donors</p>
                    <p className="text-3xl font-bold text-gray-900">{systemStats.totalDonors.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Requests</p>
                    <p className="text-3xl font-bold text-gray-900">{systemStats.activeRequests}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {systemStats.activeRequests > 0 ? 'Needs attention' : 'All clear'}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{systemStats.successRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lives Saved</p>
                    <p className="text-3xl font-bold text-gray-900">{systemStats.totalLivesSaved.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +23 this week
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Pending Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingActions.length > 0 ? (
                    <div className="space-y-4">
                      {pendingActions.map((action) => (
                        <div key={action.id} className="p-4 border border-gray-100 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={getPriorityColor(action.priority)}>
                                {action.priority}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAction(action.id)}
                            >
                              Handle
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {action.type === 'donor_verification' 
                              ? `Verify donor: ${action.donor} (${action.bloodType})`
                              : action.message
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                      <p className="text-gray-600">No pending actions at the moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Blood Type Distribution</span>
                    <span className="text-sm font-medium text-gray-900">View Details</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">O+</span>
                      <span className="font-medium">38%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">A+</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">B+</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Other</span>
                      <span className="font-medium">16%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Recent Activity & System Health */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-amber-500' :
                          activity.status === 'info' ? 'bg-blue-500' : 'bg-red-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Database</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Healthy
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">API Services</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Operational
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Geolocation</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="text-sm font-medium text-gray-900">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="text-sm font-medium text-gray-900">~45ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="text-sm font-medium text-gray-900">1,247</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
