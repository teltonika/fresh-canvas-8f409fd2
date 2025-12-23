import { 
  LayoutDashboard, 
  Cpu, 
  Car, 
  Users, 
  UsersRound, 
  Share2, 
  FileText, 
  Settings,
  Bell,
  User,
  Search,
  BarChart3,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Cpu, label: "Devices" },
  { icon: Car, label: "Vehicles" },
  { icon: Users, label: "Users" },
  { icon: UsersRound, label: "Groups" },
  { icon: Share2, label: "Share" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

interface HeaderProps {
  onAnalyticsClick?: () => void;
  onGeofenceClick?: () => void;
  onDriversClick?: () => void;
}

export function Header({ onAnalyticsClick, onGeofenceClick, onDriversClick }: HeaderProps) {
  return (
    <header className="h-16 glass border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <Logo size="md" />
        <div className="transition-transform duration-300 group-hover:translate-x-0.5">
          <h1 className="text-lg font-bold text-gradient tracking-tight">EEVY GPS</h1>
          <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-widest uppercase">Fleet Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            size="sm"
            className={`gap-2 ${
              item.active 
                ? "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="w-48 pl-9 bg-secondary/50 border-border/50 focus:border-primary/50 h-9"
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground hover:bg-primary/20"
          onClick={onDriversClick}
          title="Manage Drivers"
        >
          <Users className="w-5 h-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground hover:bg-primary/20"
          onClick={onGeofenceClick}
          title="Geofences"
        >
          <Shield className="w-5 h-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground hover:bg-primary/20"
          onClick={onAnalyticsClick}
          title="Analytics"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </Button>
        
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
