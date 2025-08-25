import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wrench,
  CreditCard,
  DollarSign,
  Settings,
  Cog,
  Bell,
  LogOut,
  Menu,
  ChevronDown,
  Car,
  AlertTriangle,
  Package
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Mechanics",
    url: "/mechanics",
    icon: Wrench,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Payouts",
    url: "/payouts",
    icon: DollarSign,
  }
];

const serviceItems = [
  {
    title: "SOS Services",
    url: "/services/sos",
    icon: AlertTriangle,
  },
  {
    title: "Services",
    url: "/services/regular",
    icon: Settings,
  },
  {
    title: "Parts",
    url: "/services/parts",
    icon: Package,
  }
];

const masterItems = [
  {
    title: "Slots",
    url: "/master/slots",
    icon: Calendar,
  },
  {
    title: "Vehicle Models",
    url: "/master/vehicle-models",
    icon: Car,
  },
  {
    title: "App Configuration",
    url: "/master/config",
    icon: Cog,
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(true);
  const [masterOpen, setMasterOpen] = useState(true);
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} variant="sidebar">
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground">Vehicle Sathi</span>
                <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Services Section */}
        <SidebarGroup>
          <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex items-center justify-between hover:bg-sidebar-accent/50 px-2 py-1 rounded-md">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {!isCollapsed && <span>Services</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {serviceItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavClass(item.url)}>
                          <item.icon className="w-4 h-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Master Section */}
        <SidebarGroup>
          <Collapsible open={masterOpen} onOpenChange={setMasterOpen}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex items-center justify-between hover:bg-sidebar-accent/50 px-2 py-1 rounded-md">
                <div className="flex items-center gap-2">
                  <Cog className="w-4 h-4" />
                  {!isCollapsed && <span>Master</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${masterOpen ? 'rotate-180' : ''}`} />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {masterItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavClass(item.url)}>
                          <item.icon className="w-4 h-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Notifications */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/notifications" className={getNavClass("/notifications")}>
                    <Bell className="w-4 h-4" />
                    {!isCollapsed && <span>Notifications</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}