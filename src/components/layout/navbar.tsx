import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Calculator,
  History,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Navigation Bar Component
 */
export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user?.username) return "U";
    return user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Lot Calculator",
      path: "/lot-calculator",
      icon: Calculator,
    },
    {
      name: "Trade History",
      path: "/trade-history",
      icon: History,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
    },
  ];

  const secondaryNavigation = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            <span className="hidden sm:inline">Forex Helper</span>
            <span className="sm:hidden">Forex</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              onClick={() => {
                navigate(item.path);
              }}
              size="sm"
              className="gap-2"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-2" />

          {secondaryNavigation.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              onClick={() => {
                navigate(item.path);
              }}
              size="sm"
              className="gap-2"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-2" />

          <ThemeToggleButton />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarFallback className="bg-primary/10 text-primary rounded-full">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email || ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggleButton />
          {user && (
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-full">
              <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm rounded-full">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 sm:h-11 sm:w-11"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
                size="sm"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
            <Separator className="my-2" />
            {secondaryNavigation.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
                size="sm"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
            <Separator className="my-2" />
            {user && (
              <div className="px-3 py-2 space-y-1">
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

