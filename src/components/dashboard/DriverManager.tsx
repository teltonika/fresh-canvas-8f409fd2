import { useState } from "react";
import { X, Users, User, Car, Shield, Plus, Trash2, Mail, Phone, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDrivers, type Driver } from "@/hooks/useDrivers";
import type { Vehicle } from "./VehicleList";
import { toast } from "sonner";

interface DriverManagerProps {
  isVisible: boolean;
  onClose: () => void;
  vehicles?: Vehicle[];
}

export function DriverManager({ isVisible, onClose, vehicles = [] }: DriverManagerProps) {
  const { drivers, createDriver, deleteDriver, assignVehicle } = useDrivers();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license_number: '',
    license_expiry: '',
    status: 'available' as Driver['status'],
    safety_score: 100,
  });

  if (!isVisible) return null;

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a driver name');
      return;
    }

    createDriver({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      license_number: formData.license_number || null,
      license_expiry: formData.license_expiry || null,
      avatar_url: null,
      status: formData.status,
      safety_score: formData.safety_score,
      assigned_vehicle_id: null,
    });

    toast.success('Driver added successfully');
    setIsCreating(false);
    setFormData({ name: '', email: '', phone: '', license_number: '', license_expiry: '', status: 'available', safety_score: 100 });
  };

  const handleDelete = (id: string) => {
    deleteDriver(id);
    toast.success('Driver removed');
  };

  const handleAssignVehicle = (driverId: string, vehicleId: string) => {
    assignVehicle(driverId, vehicleId === 'none' ? null : vehicleId);
    toast.success('Vehicle assigned');
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    available: { label: 'Available', color: 'border-success/30 text-success' },
    on_trip: { label: 'On Trip', color: 'border-primary/30 text-primary' },
    off_duty: { label: 'Off Duty', color: 'border-muted-foreground/30 text-muted-foreground' },
    suspended: { label: 'Suspended', color: 'border-destructive/30 text-destructive' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass border border-border/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Driver Management</h2>
              <p className="text-sm text-muted-foreground">{drivers.length} drivers registered</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Driver
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-border/50 grid grid-cols-4 gap-4">
          <StatCard label="Total Drivers" value={drivers.length.toString()} icon={Users} />
          <StatCard label="Available" value={drivers.filter(d => d.status === 'available').length.toString()} icon={User} color="success" />
          <StatCard label="On Trip" value={drivers.filter(d => d.status === 'on_trip').length.toString()} icon={Car} color="primary" />
          <StatCard label="Avg Safety" value={drivers.length > 0 ? Math.round(drivers.reduce((a, d) => a + d.safety_score, 0) / drivers.length).toString() + '%' : 'N/A'} icon={Shield} color="warning" />
        </div>

        {/* Create form */}
        {isCreating && (
          <div className="p-6 border-b border-border/50 bg-secondary/20">
            <h3 className="font-medium mb-4">Add New Driver</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Name *" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
              <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
              <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate}>Add Driver</Button>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Driver list */}
        <ScrollArea className="h-96">
          <div className="divide-y divide-border/50">
            {drivers.map((driver) => (
              <div key={driver.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{driver.name}</h4>
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[driver.status].color}`}>
                        {statusConfig[driver.status].label}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {driver.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{driver.email}</span>}
                      {driver.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{driver.phone}</span>}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span>Trips: {driver.total_trips}</span>
                      <span>Distance: {driver.total_distance.toLocaleString()} km</span>
                      <span>Safety: {driver.safety_score}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={driver.assigned_vehicle_id || 'none'} onValueChange={(v) => handleAssignVehicle(driver.id, v)}>
                      <SelectTrigger className="w-40 h-8 text-xs">
                        <SelectValue placeholder="Assign vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No vehicle</SelectItem>
                        {vehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(driver.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color?: string }) {
  return (
    <div className="bg-secondary/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color ? `text-${color}` : 'text-muted-foreground'}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
