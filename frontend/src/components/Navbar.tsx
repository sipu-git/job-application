import { Link, useNavigate } from "react-router-dom";
import { Home, User, LogOut, PenSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">JP</span>
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:block">JobPlatform</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-3 text-muted-foreground hover:text-primary">
            <Link to="/">
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Feed</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-3 text-muted-foreground hover:text-primary">
            <Link to="/profile">
              <User className="h-5 w-5" />
              <span className="text-[10px]">Profile</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto py-1.5 px-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
