import { useState } from "react";
import { 
  Car, 
  MapPin, 
  Gauge, 
  Battery, 
  Signal,
  Search,
  ChevronDown,
  Circle,
  Clock,
  Route,
  User,
  Wifi,
  Power,
  Navigation,
  Timer,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  lat: number;
  lng: number;
  status: 'moving' | 'stopped' | 'idle';
  speed: number;
  heading: number;
  battery: number;
  lastUpdate: string;
  address: string;
  // Extended stats
  tripDuration?: string;
  tripDistance?: number;
  maxSpeed?: number;
  totalDuration?: string;
  totalDistance?: number;
  drivingScore?: number;
  harshAcceleration?: number;
  harshBraking?: number;
  harshCornering?: number;
  ignitionStatus?: boolean;
  signalStrength?: number;
  tripCount?: number;
}

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function VehicleList({ vehicles, selectedId, onSelect }: VehicleListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'all' | 'moving' | 'stopped' | 'idle'>('all');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                         v.plate.toLowerCase().includes(search.toLowerCase()) ||
                         v.driver.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: vehicles.length,
    moving: vehicles.filter(v => v.status === 'moving').length,
    stopped: vehicles.filter(v => v.status === 'stopped').length,
    idle: vehicles.filter(v => v.status === 'idle').length,
  };

  return (
    <div className="w-96 glass border-r border-border/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            Vehicles
          </h2>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            {vehicles.length} total
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50 h-9"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-border/50 flex gap-2 overflow-x-auto">
        {(['all', 'moving', 'stopped', 'idle'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "ghost"}
            size="sm"
            className={`h-7 px-3 text-xs capitalize flex-shrink-0 transition-all duration-300 ${
              filter === status 
                ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,255,170,0.2)]" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilter(status)}
          >
            {status !== 'all' && (
              <Circle className={`w-2 h-2 mr-1.5 fill-current ${
                status === 'moving' ? 'text-success' :
                status === 'stopped' ? 'text-destructive' : 'text-warning'
              }`} />
            )}
            {status} ({statusCounts[status]})
          </Button>
        ))}
      </div>

      {/* Vehicle List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredVehicles.map((vehicle, index) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              isSelected={selectedId === vehicle.id}
              onClick={() => onSelect(vehicle.id)}
              delay={index * 50}
            />
          ))}
          
          {filteredVehicles.length === 0 && (
            <div className="p-8 text-center animate-fade-in">
              <Car className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No vehicles found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
  delay: number;
}

function VehicleCard({ vehicle, isSelected, onClick, delay }: VehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    moving: { 
      color: 'bg-success', 
      text: 'text-success', 
      label: 'Moving', 
      icon: Navigation,
      ringColor: 'bg-success/30',
      glowColor: 'shadow-[0_0_12px_hsl(var(--success)/0.4)]'
    },
    stopped: { 
      color: 'bg-destructive', 
      text: 'text-destructive', 
      label: 'Stopped', 
      icon: Power,
      ringColor: 'bg-destructive/30',
      glowColor: 'shadow-[0_0_12px_hsl(var(--destructive)/0.4)]'
    },
    idle: { 
      color: 'bg-warning', 
      text: 'text-warning', 
      label: 'Idle', 
      icon: Timer,
      ringColor: 'bg-warning/30',
      glowColor: 'shadow-[0_0_12px_hsl(var(--warning)/0.4)]'
    },
  };

  const status = statusConfig[vehicle.status];
  const StatusIcon = status.icon;

  return (
    <div 
      className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 animate-fade-in ${
        isSelected 
          ? "bg-primary/10 border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.2)] scale-[1.02]" 
          : "bg-secondary/30 border border-transparent hover:bg-secondary/50 hover:border-border/50 hover:shadow-lg hover:-translate-y-0.5"
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main content */}
      <div className="flex items-start gap-3">
        {/* Status indicator with animated ring */}
        <div className="relative">
          <div className={`w-10 h-10 rounded-lg ${status.color}/20 border border-current/30 flex items-center justify-center ${status.text} transition-all duration-300 group-hover:scale-110 ${isHovered ? status.glowColor : ''}`}>
            <Car className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
          </div>
          
          {/* Animated status dot */}
          <div className="absolute -bottom-0.5 -right-0.5">
            {/* Outer ring animation for moving vehicles */}
            {vehicle.status === 'moving' && (
              <div className={`absolute inset-0 w-3 h-3 rounded-full ${status.ringColor} animate-status-ring`} />
            )}
            <div className={`relative w-3 h-3 rounded-full ${status.color} border-2 border-background ${vehicle.status === 'moving' ? 'animate-status-pulse' : ''}`} />
          </div>
          
          {/* Live indicator for moving */}
          {vehicle.status === 'moving' && isHovered && (
            <div className="absolute -top-1 -left-1 px-1 py-0.5 bg-success/90 rounded text-[8px] font-bold text-success-foreground animate-bounce-subtle">
              LIVE
            </div>
          )}
        </div>

        {/* Vehicle info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`font-medium text-foreground truncate transition-colors duration-200 ${isHovered ? 'text-primary' : ''}`}>{vehicle.name}</h3>
            <Badge 
              variant="outline" 
              className={`text-[10px] ${status.text} border-current/30 transition-all duration-300 ${isHovered ? 'scale-105 ' + status.glowColor : ''}`}
            >
              <StatusIcon className="w-2.5 h-2.5 mr-1" />
              {status.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-mono">{vehicle.plate}</span>
            <span className="text-border">•</span>
            <User className="w-3 h-3" />
            <span className="truncate">{vehicle.driver}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className={`flex items-center gap-1 transition-all duration-200 ${vehicle.speed > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              <Gauge className={`w-3 h-3 ${vehicle.speed > 0 && isHovered ? 'animate-bounce-subtle' : ''}`} />
              <span className="font-mono">{vehicle.speed} km/h</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              <Battery className="w-3 h-3" />
              <span className="font-mono">{vehicle.battery.toFixed(1)}V</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              <Signal className={`w-3 h-3 ${(vehicle.signalStrength || 0) > 80 ? 'text-success' : ''}`} />
              <span className="font-mono">{vehicle.signalStrength}%</span>
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-6 h-6 text-muted-foreground transition-all duration-200 group-hover:text-foreground hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </div>

      {/* Address with hover effect */}
      <div className="flex items-start gap-2 mt-2 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5 text-primary/70" />
        <span className="truncate">{vehicle.address}</span>
      </div>

      {/* Last update with animated indicator */}
      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground/70">
        <Clock className="w-3 h-3" />
        <span>Updated {vehicle.lastUpdate}</span>
        {vehicle.status === 'moving' && (
          <span className="ml-1 flex items-center gap-1 text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-status-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Expanded details with smooth animation */}
      <Collapsible open={isExpanded}>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
            {/* Trip info */}
            <div className="grid grid-cols-3 gap-2">
              <StatItem label="Trip" value={vehicle.tripDuration || '--'} icon={Timer} delay={0} />
              <StatItem label="Distance" value={`${vehicle.tripDistance || 0} km`} icon={Route} delay={50} />
              <StatItem label="Max" value={`${vehicle.maxSpeed || 0} km/h`} icon={Gauge} delay={100} />
            </div>

            {/* Total stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-2 transition-all duration-300 hover:bg-background/70 hover:scale-[1.02]">
                <p className="text-[10px] text-muted-foreground mb-1">Total Distance</p>
                <p className="text-sm font-mono font-semibold text-foreground">{vehicle.totalDistance?.toLocaleString() || 0} km</p>
              </div>
              <div className="bg-background/50 rounded-lg p-2 transition-all duration-300 hover:bg-background/70 hover:scale-[1.02]">
                <p className="text-[10px] text-muted-foreground mb-1">Driving Score</p>
                <div className="flex items-center gap-2">
                  <Progress value={(vehicle.drivingScore || 0) * 10} className="h-1.5 flex-1" />
                  <span className="text-sm font-mono font-semibold text-foreground">{vehicle.drivingScore || 0}</span>
                </div>
              </div>
            </div>

            {/* Harsh events */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground font-medium">Harsh Events (per 100km)</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-background/50 rounded p-1.5 text-center transition-all duration-300 hover:bg-background/70 hover:scale-105 group/event">
                  <Zap className="w-3 h-3 mx-auto text-warning mb-0.5 transition-transform group-hover/event:scale-110" />
                  <p className="text-[10px] font-mono">{vehicle.harshAcceleration || 0}</p>
                  <p className="text-[8px] text-muted-foreground">Accel</p>
                </div>
                <div className="bg-background/50 rounded p-1.5 text-center transition-all duration-300 hover:bg-background/70 hover:scale-105 group/event">
                  <Zap className="w-3 h-3 mx-auto text-destructive mb-0.5 transition-transform group-hover/event:scale-110" />
                  <p className="text-[10px] font-mono">{vehicle.harshBraking || 0}</p>
                  <p className="text-[8px] text-muted-foreground">Brake</p>
                </div>
                <div className="bg-background/50 rounded p-1.5 text-center transition-all duration-300 hover:bg-background/70 hover:scale-105 group/event">
                  <Zap className="w-3 h-3 mx-auto text-primary mb-0.5 transition-transform group-hover/event:scale-110" />
                  <p className="text-[10px] font-mono">{vehicle.harshCornering || 0}</p>
                  <p className="text-[8px] text-muted-foreground">Corner</p>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground">
                <Power className={`w-3 h-3 transition-all duration-300 ${vehicle.ignitionStatus ? 'text-success animate-status-pulse' : 'text-muted-foreground'}`} />
                <span className={vehicle.ignitionStatus ? 'text-success' : 'text-muted-foreground'}>
                  Ignition {vehicle.ignitionStatus ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground">
                <Wifi className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground">{vehicle.signalStrength}% Signal</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function StatItem({ label, value, icon: Icon, delay = 0 }: { label: string; value: string; icon: React.ElementType; delay?: number }) {
  return (
    <div 
      className="bg-background/50 rounded-lg p-2 text-center transition-all duration-300 hover:bg-background/70 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="w-3 h-3 mx-auto text-muted-foreground mb-1 transition-transform duration-200 group-hover:scale-110" />
      <p className="text-xs font-mono font-semibold text-foreground">{value}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}
