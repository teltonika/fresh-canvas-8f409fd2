import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Minus, Layers, Radio, Route } from "lucide-react";
import { useGeofences } from "@/hooks/useGeofences";
import type { TripTrack } from "@/hooks/useTripTracks";

interface MapVehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'moving' | 'stopped' | 'idle';
  speed: number;
  heading: number;
}

interface MapboxMapProps {
  vehicles: MapVehicle[];
  selectedVehicleId?: string;
  onVehicleClick?: (id: string) => void;
  selectedTrip?: TripTrack | null;
}

export function MapboxMap({ vehicles, selectedVehicleId, onVehicleClick, selectedTrip }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('mapbox_token') || '');
  const [showTokenInput, setShowTokenInput] = useState(!token);
  const [isLive, setIsLive] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const { geofences } = useGeofences();

  const handleSaveToken = () => {
    if (token.trim()) {
      localStorage.setItem('mapbox_token', token);
      setShowTokenInput(false);
      setMapError(null);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !token || showTokenInput) return;

    // Check for WebGL support first
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setMapError('WebGL is not supported in this browser or environment. The map requires WebGL to render.');
      return;
    }

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [14.5, 46.05],
        zoom: 12,
        failIfMajorPerformanceCaveat: false,
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load the map. Please check your API token or try again later.');
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => setMapLoaded(true));
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize the map. This may be due to WebGL limitations in the current environment.');
    }

    return () => {
      markers.current.forEach(m => m.remove());
      markers.current.clear();
      map.current?.remove();
    };
  }, [token, showTokenInput]);

  // Update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    vehicles.forEach((vehicle) => {
      const existingMarker = markers.current.get(vehicle.id);
      
      if (existingMarker) {
        existingMarker.setLngLat([vehicle.lng, vehicle.lat]);
      } else {
        const el = document.createElement('div');
        el.className = 'vehicle-marker';
        el.innerHTML = `
          <div class="relative cursor-pointer group">
            <div class="marker-inner w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
              vehicle.status === 'moving' ? 'bg-emerald-500 shadow-emerald-500/50' :
              vehicle.status === 'stopped' ? 'bg-red-500 shadow-red-500/50' :
              'bg-amber-500 shadow-amber-500/50'
            } shadow-lg" style="transform: rotate(${vehicle.heading}deg)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L4.5 20.3l.7.7L12 18l6.8 3 .7-.7L12 2z"/>
              </svg>
            </div>
          </div>
        `;

        el.addEventListener('click', () => onVehicleClick?.(vehicle.id));

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([vehicle.lng, vehicle.lat])
          .addTo(map.current!);

        markers.current.set(vehicle.id, marker);
      }
    });
  }, [vehicles, mapLoaded, onVehicleClick]);

  // Focus on selected vehicle
  useEffect(() => {
    if (!map.current || !selectedVehicleId || !mapLoaded) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (vehicle) {
      map.current.flyTo({
        center: [vehicle.lng, vehicle.lat],
        zoom: 14,
        duration: 1500
      });
    }
  }, [selectedVehicleId, vehicles, mapLoaded]);

  // Show error fallback UI
  if (mapError) {
    return (
      <div className="flex-1 relative bg-background flex items-center justify-center">
        <div className="glass border-border/50 p-8 rounded-2xl max-w-md w-full mx-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Map Unavailable</h3>
              <p className="text-xs text-muted-foreground">WebGL not supported</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {mapError}
          </p>
          
          <p className="text-xs text-muted-foreground mb-4">
            Try opening this app in a full browser window or ensure hardware acceleration is enabled.
          </p>
          
          <Button onClick={() => { setMapError(null); setShowTokenInput(true); }} variant="outline" className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (showTokenInput) {
    return (
      <div className="flex-1 relative bg-background flex items-center justify-center">
        <div className="glass border-border/50 p-8 rounded-2xl max-w-md w-full mx-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Mapbox API Token</h3>
              <p className="text-xs text-muted-foreground">Required for map functionality</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Get your free token at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              mapbox.com
            </a>
          </p>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
            <Button onClick={handleSaveToken} className="w-full">
              Save & Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Status indicators */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Badge 
          variant="outline" 
          className={`gap-2 ${isLive ? 'border-success/50 text-success bg-success/10' : 'border-muted-foreground/50'}`}
        >
          <Radio className={`w-3 h-3 ${isLive ? 'animate-pulse' : ''}`} />
          {isLive ? 'Live Tracking' : 'Paused'}
        </Badge>
        
        {selectedTrip && (
          <Badge variant="outline" className="gap-2 border-primary/50 text-primary bg-primary/10">
            <Route className="w-3 h-3" />
            Viewing Trip Route
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" className="glass" onClick={() => map.current?.zoomIn()}>
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="glass" onClick={() => map.current?.zoomOut()}>
          <Minus className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="glass">
          <Layers className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
