import { useState } from "react";
import { 
  Car, 
  MapPin, 
  Gauge, 
  Battery, 
  Signal,
  Search,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Route,
  User,
  Wifi,
  Power,
  StopCircle,
  Navigation,
  Timer,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

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

function VehicleCard({ 
  vehicle, 
  isSelected, 
  onClick,
  delay = 0
}: { 
  vehicle: Vehicle; 
  isSelected: boolean; 
  onClick: () => void;
  delay?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const statusColors = {
    moving: "bg-success",
    stopped: "bg-destructive",
    idle: "bg-warning",
  };

  const statusGlow = {
    moving: "shadow-[0_0_12px_rgba(34,197,94,0.6)]",
    stopped: "shadow-[0_0_12px_rgba(239,68,68,0.6)]",
    idle: "shadow-[0_0_12px_rgba(234,179,8,0.6)]",
  };

  const statusText = {
    moving: "Moving",
    stopped: "Stopped",
    idle: "Idle",
  };

  // Default values for extended stats
  const tripDuration = vehicle.tripDuration || "00:00:00";
  const tripDistance = vehicle.tripDistance || 0;
  const maxSpeed = vehicle.maxSpeed || vehicle.speed;
  const totalDuration = vehicle.totalDuration || "00:00:00";
  const totalDistance = vehicle.totalDistance || 0;
  const drivingScore = vehicle.drivingScore || 0;
  const harshAcceleration = vehicle.harshAcceleration || 0;
  const harshBraking = vehicle.harshBraking || 0;
  const harshCornering = vehicle.harshCornering || 0;
  const signalStrength = vehicle.signalStrength || 100;
  const tripCount = vehicle.tripCount || 0;

  return (
    <div 
      className={`rounded-xl cursor-pointer overflow-hidden animate-fade-in group relative
        transition-all duration-300 ease-out
        ${isSelected 
          ? "bg-gradient-to-br from-black/95 via-black/90 to-primary/10 border border-primary/50" 
          : "bg-gradient-to-br from-black/90 to-black/70 border border-border/20 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,255,170,0.1)]"
        }
        ${!isSelected && "hover:translate-y-[-2px] hover:scale-[1.01]"}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* Pulsing glow effect for selected card */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse pointer-events-none" />
      )}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" 
          style={{ boxShadow: '0 0 20px rgba(0,255,170,0.2), inset 0 0 20px rgba(0,255,170,0.05)' }}
        />
      )}
      
      {/* Header */}
      <div className="p-3 border-b border-border/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${statusColors[vehicle.status]} ${statusGlow[vehicle.status]} transition-all duration-300`} />
            {vehicle.status === 'moving' && (
              <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-40" />
            )}
          </div>
          <h4 className="font-semibold text-foreground text-sm flex-1 group-hover:text-primary transition-colors duration-300">
            {vehicle.name}
          </h4>
          <Badge 
            variant="outline" 
            className="text-[10px] border-primary/50 text-primary bg-primary/10 px-2 py-0.5 
              transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_8px_rgba(0,255,170,0.3)]"
          >
            {vehicle.plate}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] bg-secondary/30 px-2 py-0.5 backdrop-blur-sm">
            <User className="w-2.5 h-2.5 mr-1 text-primary" />
            {vehicle.driver || "Unknown Driver"}
          </Badge>
        </div>
      </div>

      {/* Quick Stats Row 1 */}
      <div className="px-3 py-2 grid grid-cols-4 gap-2 border-b border-border/10 text-[10px]">
        <div className="flex items-center gap-1.5 text-muted-foreground group/stat hover:text-primary transition-colors duration-200">
          <Clock className="w-3 h-3 text-primary/70 group-hover/stat:text-primary transition-colors" />
          <span className="font-mono">{tripDuration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground group/stat hover:text-primary transition-colors duration-200">
          <Route className="w-3 h-3 text-primary/70 group-hover/stat:text-primary transition-colors" />
          <span className="font-mono">{tripDistance} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="w-3 h-3" />
          <span>/</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground group/stat hover:text-success transition-colors duration-200">
          <Battery className="w-3 h-3 text-success/70 group-hover/stat:text-success transition-colors" />
          <span className="font-mono">{vehicle.battery.toFixed(1)}</span>
        </div>
      </div>

      {/* Quick Stats Row 2 */}
      <div className="px-3 py-2 grid grid-cols-4 gap-2 border-b border-border/10 text-[10px]">
        <div className="flex items-center gap-1 text-muted-foreground col-span-1">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <div 
                key={i} 
                className={`w-1 h-2.5 rounded-sm transition-all duration-300 ${
                  i <= Math.ceil(signalStrength/20) 
                    ? 'bg-success shadow-[0_0_4px_rgba(34,197,94,0.5)]' 
                    : 'bg-muted/30'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Power className={`w-3 h-3 transition-all duration-300 ${
            vehicle.ignitionStatus !== false 
              ? 'text-success drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]' 
              : 'text-muted/50'
          }`} />
          <span className={vehicle.ignitionStatus !== false ? 'text-success' : 'text-muted-foreground'}>
            {vehicle.ignitionStatus !== false ? 'ON' : 'OFF'}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 transition-colors duration-200 ${
          vehicle.status === 'moving' ? 'text-success' :
          vehicle.status === 'stopped' ? 'text-destructive' : 'text-warning'
        }`}>
          <StopCircle className="w-3 h-3" />
          <span>{statusText[vehicle.status]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Navigation className="w-3 h-3 text-primary/70" />
          <span className="font-mono">{Math.round(vehicle.heading)}°</span>
        </div>
      </div>

      {/* Speed Stats */}
      <div className="px-3 py-2 grid grid-cols-4 gap-2 border-b border-border/10 text-[10px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>/</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground group/stat hover:text-primary transition-colors duration-200">
          <Gauge className="w-3 h-3 text-primary/70 group-hover/stat:text-primary transition-colors" />
          <span className="font-mono">{maxSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5 text-success">
          <Zap className="w-3 h-3 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
          <span className="font-mono font-semibold">{vehicle.speed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Timer className="w-3 h-3" />
          <span className="font-mono">{tripCount}</span>
        </div>
      </div>

      {/* Address */}
      <div className="px-3 py-2 border-b border-border/10">
        <div className="flex items-start gap-1.5">
          <MapPin className="w-3 h-3 text-primary flex-shrink-0 mt-0.5 drop-shadow-[0_0_4px_rgba(0,255,170,0.4)]" />
          <p className="text-[10px] text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors duration-200">
            {vehicle.address}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-3 py-2 grid grid-cols-4 gap-1.5 border-b border-border/10">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-1.5 text-center 
          border border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_10px_rgba(0,255,170,0.2)]">
          <div className="text-[8px] text-primary/70 mb-0.5">Total duration</div>
          <div className="text-[10px] font-mono text-primary font-semibold">{totalDuration}</div>
        </div>
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-1.5 text-center 
          border border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_10px_rgba(0,255,170,0.2)]">
          <div className="text-[8px] text-primary/70 mb-0.5">Total distance</div>
          <div className="text-[10px] font-mono text-primary font-semibold">{totalDistance} km</div>
        </div>
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-1.5 text-center 
          border border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_10px_rgba(0,255,170,0.2)]">
          <div className="text-[8px] text-primary/70 mb-0.5">Max speed</div>
          <div className="text-[10px] font-mono text-primary font-semibold">{maxSpeed} km/h</div>
        </div>
        <div className={`rounded-lg p-1.5 text-center border transition-all duration-300 hover:shadow-[0_0_10px] ${
          drivingScore >= 7 
            ? 'bg-gradient-to-br from-success/20 to-success/5 border-success/30 hover:border-success/50 hover:shadow-success/20' 
            : drivingScore >= 4 
              ? 'bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30 hover:border-warning/50 hover:shadow-warning/20' 
              : 'bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/30 hover:border-destructive/50 hover:shadow-destructive/20'
        }`}>
          <div className={`text-[8px] mb-0.5 ${
            drivingScore >= 7 ? 'text-success/70' : drivingScore >= 4 ? 'text-warning/70' : 'text-destructive/70'
          }`}>Driving score</div>
          <div className={`text-[10px] font-mono font-semibold ${
            drivingScore >= 7 ? 'text-success' : drivingScore >= 4 ? 'text-warning' : 'text-destructive'
          }`}>{drivingScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Expand Toggle */}
      <button 
        className="w-full px-3 py-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground 
          hover:text-primary hover:bg-primary/5 transition-all duration-300"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        <div className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-3 h-3" />
        </div>
        <span>{expanded ? "Less details" : "More details"}</span>
      </button>

      {/* Expanded Details */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out ${
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pb-3 space-y-3 border-t border-border/10 pt-3">
          {/* Harsh Acceleration */}
          <div className="group/progress">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground group-hover/progress:text-foreground transition-colors">
                Harsh acceleration
              </span>
              <span className="text-[10px] font-mono text-warning">{harshAcceleration.toFixed(2)}%</span>
            </div>
            <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-warning/70 to-warning rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                style={{ width: `${harshAcceleration}%` }}
              />
            </div>
          </div>

          {/* Harsh Braking */}
          <div className="group/progress">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground group-hover/progress:text-foreground transition-colors">
                Harsh braking
              </span>
              <span className="text-[10px] font-mono text-primary">{harshBraking.toFixed(2)}%</span>
            </div>
            <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,255,170,0.4)]"
                style={{ width: `${harshBraking}%` }}
              />
            </div>
          </div>

          {/* Harsh Cornering */}
          <div className="group/progress">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground group-hover/progress:text-foreground transition-colors">
                Harsh cornering
              </span>
              <span className="text-[10px] font-mono text-success">{harshCornering.toFixed(2)}%</span>
            </div>
            <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success/70 to-success rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                style={{ width: `${harshCornering}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
