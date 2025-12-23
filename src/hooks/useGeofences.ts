import { useState, useCallback } from 'react';

export interface Geofence {
  id: string;
  name: string;
  description: string | null;
  type: 'circle' | 'polygon';
  center_lat: number | null;
  center_lng: number | null;
  radius: number | null;
  polygon: Array<{ lat: number; lng: number }> | null;
  color: string;
  is_active: boolean;
  alert_on_enter: boolean;
  alert_on_exit: boolean;
  created_at: string;
  updated_at: string;
}

// Sample geofences data
const sampleGeofences: Geofence[] = [
  {
    id: '1',
    name: 'Ljubljana Office',
    description: 'Main office zone',
    type: 'circle',
    center_lat: 46.0569,
    center_lng: 14.5058,
    radius: 500,
    polygon: null,
    color: '#00D4FF',
    is_active: true,
    alert_on_enter: true,
    alert_on_exit: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Warehouse Zone',
    description: 'Delivery warehouse area',
    type: 'circle',
    center_lat: 46.08,
    center_lng: 14.52,
    radius: 300,
    polygon: null,
    color: '#FF6B00',
    is_active: true,
    alert_on_enter: false,
    alert_on_exit: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useGeofences() {
  const [geofences, setGeofences] = useState<Geofence[]>(sampleGeofences);
  const [loading, setLoading] = useState(false);

  const fetchGeofences = useCallback(() => {
    setLoading(true);
    // Already loaded from initial state
    setLoading(false);
  }, []);

  const createGeofence = useCallback((geofence: Omit<Geofence, 'id' | 'created_at' | 'updated_at'>) => {
    const newGeofence: Geofence = {
      ...geofence,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGeofences(prev => [newGeofence, ...prev]);
    return newGeofence;
  }, []);

  const updateGeofence = useCallback((id: string, updates: Partial<Geofence>) => {
    setGeofences(prev => prev.map(g => 
      g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
    ));
    return true;
  }, []);

  const deleteGeofence = useCallback((id: string) => {
    setGeofences(prev => prev.filter(g => g.id !== id));
    return true;
  }, []);

  const toggleGeofence = useCallback((id: string) => {
    const geofence = geofences.find(g => g.id === id);
    if (geofence) {
      return updateGeofence(id, { is_active: !geofence.is_active });
    }
    return false;
  }, [geofences, updateGeofence]);

  return {
    geofences,
    loading,
    fetchGeofences,
    createGeofence,
    updateGeofence,
    deleteGeofence,
    toggleGeofence
  };
}
