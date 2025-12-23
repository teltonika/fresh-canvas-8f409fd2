import { useState } from "react";
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff,
  Circle,
  Hexagon,
  MapPin,
  Bell,
  BellOff,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGeofences, type Geofence } from "@/hooks/useGeofences";
import { toast } from "sonner";

interface GeofenceManagerProps {
  isVisible: boolean;
  onClose: () => void;
  onGeofenceSelect?: (geofence: Geofence) => void;
}

export function GeofenceManager({ isVisible, onClose, onGeofenceSelect }: GeofenceManagerProps) {
  const { geofences, loading, createGeofence, updateGeofence, deleteGeofence, toggleGeofence } = useGeofences();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'circle' as 'circle' | 'polygon',
    center_lat: 46.05,
    center_lng: 14.5,
    radius: 500,
    color: '#00D4FF',
    alert_on_enter: true,
    alert_on_exit: true,
  });

  if (!isVisible) return null;

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a geofence name');
      return;
    }

    const result = await createGeofence({
      name: formData.name,
      description: formData.description || null,
      type: formData.type,
      center_lat: formData.center_lat,
      center_lng: formData.center_lng,
      radius: formData.radius,
      polygon: null,
      color: formData.color,
      is_active: true,
      alert_on_enter: formData.alert_on_enter,
      alert_on_exit: formData.alert_on_exit,
    });

    if (result) {
      toast.success('Geofence created successfully');
      setIsCreating(false);
      resetForm();
    } else {
      toast.error('Failed to create geofence');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteGeofence(id);
    if (result) {
      toast.success('Geofence deleted');
    } else {
      toast.error('Failed to delete geofence');
    }
  };

  const handleToggle = async (id: string) => {
    await toggleGeofence(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'circle',
      center_lat: 46.05,
      center_lng: 14.5,
      radius: 500,
      color: '#00D4FF',
      alert_on_enter: true,
      alert_on_exit: true,
    });
  };

  const colorOptions = ['#00D4FF', '#22C55E', '#EAB308', '#EF4444', '#A855F7', '#EC4899'];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto animate-fade-in">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Geofence Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage geographic boundaries</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Geofence
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
              Create New Geofence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Warehouse Zone"
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description"
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="lat">Center Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={formData.center_lat}
                  onChange={(e) => setFormData(f => ({ ...f, center_lat: parseFloat(e.target.value) }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="lng">Center Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={formData.center_lng}
                  onChange={(e) => setFormData(f => ({ ...f, center_lng: parseFloat(e.target.value) }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="radius">Radius (meters)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData(f => ({ ...f, radius: parseInt(e.target.value) }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>

            <div className="mb-4">
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData(f => ({ ...f, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.alert_on_enter}
                  onCheckedChange={(checked) => setFormData(f => ({ ...f, alert_on_enter: checked }))}
                />
                <Label>Alert on enter</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.alert_on_exit}
                  onCheckedChange={(checked) => setFormData(f => ({ ...f, alert_on_exit: checked }))}
                />
                <Label>Alert on exit</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setIsCreating(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                <Check className="w-4 h-4 mr-2" />
                Create Geofence
              </Button>
            </div>
          </div>
        )}

        {/* Geofence List */}
        <div className="glass border border-border/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-secondary/20">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">
                {geofences.length} Geofence{geofences.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading geofences...</p>
              </div>
            ) : geofences.length === 0 ? (
              <div className="p-8 text-center">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No geofences created yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first geofence
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {geofences.map((geofence) => (
                  <GeofenceCard
                    key={geofence.id}
                    geofence={geofence}
                    onToggle={() => handleToggle(geofence.id)}
                    onDelete={() => handleDelete(geofence.id)}
                    onClick={() => onGeofenceSelect?.(geofence)}
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

function GeofenceCard({ 
  geofence, 
  onToggle, 
  onDelete,
  onClick 
}: { 
  geofence: Geofence;
  onToggle: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <div 
      className={`p-4 hover:bg-secondary/30 transition-colors cursor-pointer ${
        !geofence.is_active ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Color indicator */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${geofence.color}20`, border: `2px solid ${geofence.color}` }}
        >
          {geofence.type === 'circle' ? (
            <Circle className="w-5 h-5" style={{ color: geofence.color }} />
          ) : (
            <Hexagon className="w-5 h-5" style={{ color: geofence.color }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{geofence.name}</h4>
            <Badge 
              variant="outline" 
              className={`text-[10px] ${geofence.is_active ? 'border-success/30 text-success' : 'border-muted-foreground/30'}`}
            >
              {geofence.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          {geofence.description && (
            <p className="text-xs text-muted-foreground mb-2">{geofence.description}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {geofence.center_lat?.toFixed(4)}, {geofence.center_lng?.toFixed(4)}
            </span>
            {geofence.radius && (
              <span>{geofence.radius}m radius</span>
            )}
            <div className="flex items-center gap-2">
              {geofence.alert_on_enter && (
                <span className="flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  Enter
                </span>
              )}
              {geofence.alert_on_exit && (
                <span className="flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  Exit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={onToggle}
          >
            {geofence.is_active ? (
              <Eye className="w-4 h-4 text-muted-foreground" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
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
