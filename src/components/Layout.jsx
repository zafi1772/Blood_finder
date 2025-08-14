import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, 
  MapPin, 
  Users, 
  Settings, 
  Activity,
  Bell,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Find Blood",
    url: createPageUrl("FindBlood"),
    icon: MapPin,
    description: "Request blood donors",
  },
  {
    title: "Donor Dashboard",
    url: createPageUrl("DonorDashboard"),
    icon: Heart,
    description: "Manage availability",
  },
  {
    title: "My Requests",
    url: createPageUrl("MyRequests"),
    icon: Activity,
    description: "Track your requests",
  },
  {
    title: "Admin Panel",
    url: createPageUrl("AdminPanel"),
    icon: Users,
    description: "System management",
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --medical-red: #DC2626;
          --medical-red-hover: #B91C1C;
          --medical-red-light: #FEE2E2;
          --success-green: #10B981;
          --warning-amber: #F59E0B;
          --neutral-50: #F8FAFC;
          --neutral-100: #F1F5F9;
          --neutral-500: #64748B;
          --neutral-900: #0F172A;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #FAFAFA 0%, #F8FAFC 100%);
        }
        
        .medical-gradient {
          background: linear-gradient(135deg, var(--medical-red) 0%, #EF4444 100%);
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .card-shadow-lg {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      <div className="min-h-screen flex w-full gradient-bg">
        <Sidebar className="border-r border-gray-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 medical-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">Blood Finder</h2>
                <p className="text-xs text-gray-500 font-medium">Save Lives Together</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`mb-1 rounded-xl p-3 transition-all duration-200 hover:bg-red-50 hover:text-red-700 group ${
                          location.pathname === item.url ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{item.title}</span>
                            <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Active Donors</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
                      24
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Open Requests</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 font-semibold">
                      3
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Lives Saved</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-700 font-semibold">
                      156
                    </Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">Demo User</p>
                <p className="text-xs text-gray-500 truncate">Verified Donor</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                <h1 className="text-lg font-bold text-gray-900">Blood Finder</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}