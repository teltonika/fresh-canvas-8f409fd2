import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Key,
  Shield,
  Radio,
  Play,
  Pause,
  Route
} from "lucide-react";
import { useGeofences, type Geofence } from '@/hooks/useGeofences';
import { Badge } from '@/components/ui/badge';
import type { TripTrack } from '@/hooks/useTripTracks';

interface MapboxMapProps {
  vehicles: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    status: 'moving' | 'stopped' | 'idle';
    speed: number;
    heading: number;
  }>;
  onVehicleClick?: (id: string) => void;
  selectedVehicleId?: string;
  selectedTrip?: TripTrack | null;
}

export function MapboxMap({ vehicles, onVehicleClick, selectedVehicleId, selectedTrip }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [token, setToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem('mapbox_token'));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const { geofences } = useGeofences();

  const handleSaveToken = () => {
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setShowTokenInput(false);
      window.location.reload();
    }
  };

  // Draw trip route on map
  const drawTripRoute = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'trip-route';
    const layerId = 'trip-route-layer';
    const pointsLayerId = 'trip-points-layer';

    // Remove existing layers
    if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
    if (map.current.getLayer(pointsLayerId)) map.current.removeLayer(pointsLayerId);
    if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

    if (!selectedTrip || selectedTrip.coordinates.length === 0) return;

    const coordinates = selectedTrip.coordinates.map(c => [c.lng, c.lat]);

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });

    // Add route line
    map.current.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#00D4FF',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    // Fit map to route bounds
    if (coordinates.length > 1) {
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord as [number, number]);
      }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });
    }
  }, [selectedTrip, mapLoaded]);

  // Draw geofences on map
  const drawGeofences = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing geofence layers and sources
    geofences.forEach(geofence => {
      const sourceId = `geofence-${geofence.id}`;
      const layerId = `geofence-layer-${geofence.id}`;
      const outlineId = `geofence-outline-${geofence.id}`;

      if (map.current?.getLayer(layerId)) map.current.removeLayer(layerId);
      if (map.current?.getLayer(outlineId)) map.current.removeLayer(outlineId);
      if (map.current?.getSource(sourceId)) map.current.removeSource(sourceId);
    });

    // Add geofence circles
    geofences.filter(g => g.is_active && g.type === 'circle').forEach(geofence => {
      if (!geofence.center_lat || !geofence.center_lng || !geofence.radius) return;

      const sourceId = `geofence-${geofence.id}`;
      const layerId = `geofence-layer-${geofence.id}`;
      const outlineId = `geofence-outline-${geofence.id}`;

      const radiusInKm = geofence.radius / 1000;
      const points = 64;
      const coords = [];

      for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points;
        const lat = geofence.center_lat + (radiusInKm / 111) * Math.cos((angle * Math.PI) / 180);
        const lng = geofence.center_lng + (radiusInKm / (111 * Math.cos((geofence.center_lat * Math.PI) / 180))) * Math.sin((angle * Math.PI) / 180);
        coords.push([lng, lat]);
      }
      coords.push(coords[0]);

      map.current?.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: geofence.name },
          geometry: {
            type: 'Polygon',
            coordinates: [coords]
          }
        }
      });

      map.current?.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': geofence.color,
          'fill-opacity': 0.15
        }
      });

      map.current?.addLayer({
        id: outlineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': geofence.color,
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });
    });
  }, [geofences, mapLoaded]);

  useEffect(() => {
    if (!mapContainer.current || !token || showTokenInput) return;

    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [14.5, 46.05],
        zoom: 10,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.on('load', () => {
        setMapLoaded(true);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setShowTokenInput(true);
      localStorage.removeItem('mapbox_token');
    }

    return () => {
      map.current?.remove();
    };
  }, [token, showTokenInput]);

  // Draw geofences when they change
  useEffect(() => {
    drawGeofences();
  }, [drawGeofences]);

  // Draw trip route when selected trip changes
  useEffect(() => {
    drawTripRoute();
  }, [drawTripRoute]);

  // Update markers when vehicles change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    vehicles.forEach((vehicle) => {
      const existingMarker = markers.current.get(vehicle.id);
      
      if (existingMarker) {
        existingMarker.setLngLat([vehicle.lng, vehicle.lat]);
        const el = existingMarker.getElement();
        const inner = el.querySelector('.marker-inner') as HTMLElement;
        if (inner) {
          inner.style.transform = `rotate(${vehicle.heading}deg)`;
        }
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
            ${vehicle.status === 'moving' ? '<div class="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30"></div>' : ''}
          </div>
        `;

        el.addEventListener('click', () => onVehicleClick?.(vehicle.id));

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([vehicle.lng, vehicle.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25, className: 'dark-popup' })
              .setHTML(`
                <div class="p-2 bg-slate-900 text-white rounded">
                  <strong>${vehicle.name}</strong>
                  <p class="text-xs text-gray-400">${vehicle.speed} km/h</p>
                </div>
              `)
          )
          .addTo(map.current!);

        markers.current.set(vehicle.id, marker);
      }
    });
  }, [vehicles, mapLoaded, onVehicleClick]);

  // Focus on selected vehicle
  useEffect(() => {
    if (!map.current || !selectedVehicleId || !mapLoaded || selectedTrip) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (vehicle) {
      map.current.flyTo({
        center: [vehicle.lng, vehicle.lat],
        zoom: 14,
        duration: 1500
      });
    }
  }, [selectedVehicleId, vehicles, mapLoaded, selectedTrip]);

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
            {' '}→ Tokens section
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

      {/* Map controls */}
      <div className="absolute top-16 right-4 flex flex-col gap-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="glass border-border/50 hover:bg-primary/20 hover:border-primary/30"
          onClick={() => map.current?.zoomIn()}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass border-border/50 hover:bg-primary/20 hover:border-primary/30"
          onClick={() => map.current?.zoomOut()}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass border-border/50 hover:bg-primary/20 hover:border-primary/30"
        >
          <Layers className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className={`glass border-border/50 ${isLive ? 'bg-success/20 border-success/30 text-success' : ''}`}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass border-border/50 hover:bg-primary/20 hover:border-primary/30"
          onClick={() => setShowTokenInput(true)}
        >
          <Key className="w-4 h-4" />
        </Button>
      </div>

      {/* Geofence count */}
      {geofences.filter(g => g.is_active).length > 0 && (
        <div className="absolute top-4 left-32 z-10">
          <Badge variant="outline" className="gap-2 border-primary/50 text-primary bg-primary/10">
            <Shield className="w-3 h-3" />
            {geofences.filter(g => g.is_active).length} Geofences
          </Badge>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 glass border-border/50 p-3 rounded-lg z-10">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Stopped</span>
          </div>
        </div>
      </div>
    </div>
  );
}
