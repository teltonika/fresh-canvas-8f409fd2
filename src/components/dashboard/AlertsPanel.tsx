import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, X, Bell, BellOff, Clock, MapPin, Gauge, Shield, Fuel, Thermometer, Check, ChevronDown } from "lucide-react";
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
  const filteredAlerts = alerts.filter(a => (filter === 'all' || a.type === filter) && !a.isResolved);

  if (!isExpanded) {
    return (
      <Button onClick={() => setIsExpanded(true)} className="fixed bottom-4 right-4 z-50 glass border-border/50 gap-2">
        <Bell className="w-4 h-4" />
        <span>Alerts</span>
        {unreadCount > 0 && <Badge className="bg-destructive text-destructive-foreground h-5 px-1.5">{unreadCount}</Badge>}
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50 glass border border-border/50 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Alerts</h3>
            {unreadCount > 0 && <Badge className="bg-destructive text-destructive-foreground text-xs h-5">{unreadCount} new</Badge>}
          </div>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setIsExpanded(false)}>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "ghost"}
              size="sm"
              className={`h-6 px-2 text-xs capitalize ${filter === type ? type === 'critical' ? "bg-destructive/20 text-destructive" : type === 'warning' ? "bg-warning/20 text-warning" : type === 'info' ? "bg-primary/20 text-primary" : "" : "text-muted-foreground"}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-80">
        <div className="p-2 space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={() => onDismiss(alert.id)} onResolve={() => onResolve(alert.id)} onVehicleClick={() => onVehicleClick(alert.vehicleId)} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function AlertCard({ alert, onDismiss, onResolve, onVehicleClick }: { alert: Alert; onDismiss: () => void; onResolve: () => void; onVehicleClick: () => void }) {
  const typeConfig = {
    critical: { icon: AlertTriangle, bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' },
    warning: { icon: AlertCircle, bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' },
    info: { icon: Info, bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' },
  };
  const config = typeConfig[alert.type];
  const Icon = config.icon;

  return (
    <div className={`p-3 rounded-lg border ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">{alert.title}</h4>
            <Button variant="ghost" size="icon" className="w-5 h-5" onClick={onDismiss}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
            <span className="text-primary cursor-pointer hover:underline" onClick={onVehicleClick}>{alert.vehicleName}</span>
            <span>•</span>
            <MapPin className="w-3 h-3" />
            <span>{alert.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />{alert.timestamp}
            </span>
            <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={onResolve}>
              <Check className="w-3 h-3" />Resolve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
