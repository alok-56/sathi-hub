import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-sidebar-foreground" />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Welcome back,</span>
                <span className="font-medium">Admin</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}