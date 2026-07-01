import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
// import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Header Bar */}
          <header className="h-16 min-h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9" />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                Job Portal Administration
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={()=>navigate("/")} className="relative bg-[rgba(255,16,16,0.5)] rounded-[30px] text-white w-16 h-8">
                Logout
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3 pl-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
