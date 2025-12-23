import { useState } from "react";
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  Phone,
  Mail,
  Car,
  Shield,
  Calendar,
  Award,
  Route,
  X,
  Check,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDrivers, type Driver } from "@/hooks/useDrivers";
import { toast } from "sonner";
import type { Vehicle } from "./VehicleList";

interface DriverManagerProps {
  isVisible: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
}

export function DriverManager({ isVisible, onClose, vehicles }: DriverManagerProps) {
  const { drivers, loading, createDriver, updateDriver, deleteDriver, assignVehicle } = useDrivers();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a driver name');
      return;
    }

    const result = await createDriver({
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

    if (result) {
      toast.success('Driver added successfully');
      setIsCreating(false);
      resetForm();
    } else {
      toast.error('Failed to add driver');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteDriver(id);
    if (result) {
      toast.success('Driver removed');
    } else {
      toast.error('Failed to remove driver');
    }
  };

  const handleAssignVehicle = async (driverId: string, vehicleId: string) => {
    const result = await assignVehicle(driverId, vehicleId === 'none' ? null : vehicleId);
    if (result) {
      toast.success('Vehicle assigned');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      license_number: '',
      license_expiry: '',
      status: 'available',
      safety_score: 100,
    });
  };

  const statusConfig = {
    available: { label: 'Available', color: 'border-success/30 text-success bg-success/10' },
    on_trip: { label: 'On Trip', color: 'border-primary/30 text-primary bg-primary/10' },
    off_duty: { label: 'Off Duty', color: 'border-muted-foreground/30 text-muted-foreground bg-muted/50' },
    suspended: { label: 'Suspended', color: 'border-destructive/30 text-destructive bg-destructive/10' },
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto animate-fade-in">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Driver Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Manage drivers and vehicle assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Driver
            </Button>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="glass border border-border/50 rounded-xl p-6 mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Driver
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+386 ..."
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={formData.license_number}
                  onChange={(e) => setFormData(f => ({ ...f, license_number: e.target.value }))}
                  placeholder="XX-XXXXXX"
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="expiry">License Expiry</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={formData.license_expiry}
                  onChange={(e) => setFormData(f => ({ ...f, license_expiry: e.target.value }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="score">Safety Score (0-100)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.safety_score}
                  onChange={(e) => setFormData(f => ({ ...f, safety_score: parseInt(e.target.value) || 100 }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setIsCreating(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                <Check className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            label="Total Drivers" 
            value={drivers.length.toString()} 
            icon={Users}
          />
          <StatCard 
            label="Available" 
            value={drivers.filter(d => d.status === 'available').length.toString()} 
            icon={User}
            color="success"
          />
          <StatCard 
            label="On Trip" 
            value={drivers.filter(d => d.status === 'on_trip').length.toString()} 
            icon={Car}
            color="primary"
          />
          <StatCard 
            label="Avg Safety" 
            value={drivers.length > 0 ? Math.round(drivers.reduce((a, d) => a + d.safety_score, 0) / drivers.length).toString() + '%' : 'N/A'} 
            icon={Shield}
            color="warning"
          />
        </div>

        {/* Driver List */}
        <div className="glass border border-border/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-secondary/20">
            <span className="font-medium text-sm text-foreground">
              {drivers.length} Driver{drivers.length !== 1 ? 's' : ''}
            </span>
          </div>

          <ScrollArea className="h-[450px]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading drivers...</p>
              </div>
            ) : drivers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No drivers added yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first driver
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {drivers.map((driver) => (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    vehicles={vehicles}
                    statusConfig={statusConfig}
                    onDelete={() => handleDelete(driver.id)}
                    onAssignVehicle={(vehicleId) => handleAssignVehicle(driver.id, vehicleId)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon,
  color = 'primary'
}: { 
  label: string; 
  value: string; 
  icon: React.ElementType;
  color?: 'primary' | 'success' | 'warning';
}) {
  const colors = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
  };

  return (
    <div className="glass border border-border/50 rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground font-mono">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function DriverCard({ 
  driver, 
  vehicles,
  statusConfig,
  onDelete,
  onAssignVehicle 
}: { 
  driver: Driver;
  vehicles: Vehicle[];
  statusConfig: Record<string, { label: string; color: string }>;
  onDelete: () => void;
  onAssignVehicle: (vehicleId: string) => void;
}) {
  const assignedVehicle = vehicles.find(v => v.id === driver.assigned_vehicle_id);

  return (
    <div className="p-4 hover:bg-secondary/30 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{driver.name}</h4>
            <Badge 
              variant="outline" 
              className={`text-[10px] ${statusConfig[driver.status].color}`}
            >
              {statusConfig[driver.status].label}
            </Badge>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
            {driver.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {driver.email}
              </span>
            )}
            {driver.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {driver.phone}
              </span>
            )}
            {driver.license_number && (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {driver.license_number}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Route className="w-3 h-3" />
              {driver.total_trips} trips
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Car className="w-3 h-3" />
              {driver.total_distance.toFixed(0)} km
            </span>
            <span className={`flex items-center gap-1 ${
              driver.safety_score >= 80 ? 'text-success' : 
              driver.safety_score >= 60 ? 'text-warning' : 'text-destructive'
            }`}>
              <Shield className="w-3 h-3" />
              Safety: {driver.safety_score}%
            </span>
          </div>
        </div>

        {/* Vehicle Assignment */}
        <div className="flex items-center gap-2">
          <Select 
            value={driver.assigned_vehicle_id || 'none'} 
            onValueChange={onAssignVehicle}
          >
            <SelectTrigger className="w-40 h-8 text-xs bg-secondary/50 border-border/50">
              <SelectValue placeholder="Assign vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No vehicle</SelectItem>
              {vehicles.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} ({v.plate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
