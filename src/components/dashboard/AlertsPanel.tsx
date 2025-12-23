import { useState } from "react";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info,
  X,
  Bell,
  BellOff,
  Clock,
  MapPin,
  Gauge,
  Shield,
  Fuel,
  Thermometer,
  Check,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'speed' | 'geofence' | 'maintenance' | 'fuel' | 'temperature' | 'sos';
  title: string;
  message: string;
  vehicleName: string;
  vehicleId: string;
  location: string;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onResolve: (id: string) => void;
  onVehicleClick: (vehicleId: string) => void;
}

export function AlertsPanel({ alerts, onDismiss, onResolve, onVehicleClick }: AlertsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  
  const unreadCount = alerts.filter(a => !a.isRead && !a.isResolved).length;
  const filteredAlerts = alerts.filter(a => 
    (filter === 'all' || a.type === filter) && !a.isResolved
  );

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-50 glass border-border/50 gap-2 animate-pulse-glow"
      >
        <Bell className="w-4 h-4" />
        <span>Alerts</span>
        {unreadCount > 0 && (
          <Badge className="bg-destructive text-destructive-foreground h-5 px-1.5">
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50 glass border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-slide-in-left">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Alerts</h3>
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground text-xs h-5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-7 h-7"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "ghost"}
              size="sm"
              className={`h-6 px-2 text-xs capitalize ${
                filter === type 
                  ? type === 'critical' ? "bg-destructive/20 text-destructive border border-destructive/30" :
                    type === 'warning' ? "bg-warning/20 text-warning border border-warning/30" :
                    type === 'info' ? "bg-primary/20 text-primary border border-primary/30" :
                    "bg-secondary text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <ScrollArea className="h-80">
        <div className="p-2 space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert}
                onDismiss={() => onDismiss(alert.id)}
                onResolve={() => onResolve(alert.id)}
                onVehicleClick={() => onVehicleClick(alert.vehicleId)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function AlertCard({ 
  alert, 
  onDismiss, 
  onResolve,
  onVehicleClick 
}: { 
  alert: Alert;
  onDismiss: () => void;
  onResolve: () => void;
  onVehicleClick: () => void;
}) {
  const typeConfig = {
    critical: {
      bg: "bg-destructive/10 border-destructive/30",
      icon: AlertTriangle,
      iconColor: "text-destructive",
    },
    warning: {
      bg: "bg-warning/10 border-warning/30",
      icon: AlertCircle,
      iconColor: "text-warning",
    },
    info: {
      bg: "bg-primary/10 border-primary/30",
      icon: Info,
      iconColor: "text-primary",
    },
  };

  const categoryIcons = {
    speed: Gauge,
    geofence: Shield,
    maintenance: AlertCircle,
    fuel: Fuel,
    temperature: Thermometer,
    sos: AlertTriangle,
  };

  const config = typeConfig[alert.type];
  const CategoryIcon = categoryIcons[alert.category];

  return (
    <div className={`p-3 rounded-lg border ${config.bg} group`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0`}>
          <config.icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-foreground text-sm">{alert.title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDismiss}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
            <button 
              onClick={onVehicleClick}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <CategoryIcon className="w-3 h-3" />
              <span>{alert.vehicleName}</span>
            </button>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.timestamp}
            </span>
          </div>
          
          {/* Location */}
          <div className="flex items-start gap-1 mt-2">
            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground truncate">{alert.location}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs"
          onClick={onResolve}
        >
          <Check className="w-3 h-3 mr-1" />
          Resolve
        </Button>
      </div>
    </div>
  );
}
