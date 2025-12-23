import { useState, useCallback } from 'react';

export interface Driver {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  license_expiry: string | null;
  avatar_url: string | null;
  status: 'available' | 'on_trip' | 'off_duty' | 'suspended';
  total_trips: number;
  total_distance: number;
  safety_score: number;
  assigned_vehicle_id: string | null;
  created_at: string;
  updated_at: string;
}

// Sample drivers data
const sampleDrivers: Driver[] = [
  {
    id: '1',
    name: 'Grega Novak',
    email: 'grega@example.com',
    phone: '+386 40 123 456',
    license_number: 'SI-123456',
    license_expiry: '2026-05-15',
    avatar_url: null,
    status: 'on_trip',
    total_trips: 245,
    total_distance: 19745,
    safety_score: 87,
    assigned_vehicle_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Marko Horvat',
    email: 'marko@example.com',
    phone: '+386 41 234 567',
    license_number: 'SI-234567',
    license_expiry: '2025-08-20',
    avatar_url: null,
    status: 'available',
    total_trips: 189,
    total_distance: 15230,
    safety_score: 92,
    assigned_vehicle_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ana Krajnc',
    email: 'ana@example.com',
    phone: '+386 51 345 678',
    license_number: 'SI-345678',
    license_expiry: '2027-01-10',
    avatar_url: null,
    status: 'on_trip',
    total_trips: 312,
    total_distance: 28450,
    safety_score: 95,
    assigned_vehicle_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>(sampleDrivers);
  const [loading, setLoading] = useState(false);

  const fetchDrivers = useCallback(() => {
    setLoading(true);
    // Already loaded from initial state
    setLoading(false);
  }, []);

  const createDriver = useCallback((driver: Omit<Driver, 'id' | 'created_at' | 'updated_at' | 'total_trips' | 'total_distance'>) => {
    const newDriver: Driver = {
      ...driver,
      id: Date.now().toString(),
      total_trips: 0,
      total_distance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  }, []);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => 
      d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d
    ));
    return true;
  }, []);

  const deleteDriver = useCallback((id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    return true;
  }, []);

  const assignVehicle = useCallback((driverId: string, vehicleId: string | null) => {
    // Unassign any driver currently assigned to this vehicle
    if (vehicleId) {
      setDrivers(prev => prev.map(d => 
        d.assigned_vehicle_id === vehicleId 
          ? { ...d, assigned_vehicle_id: null, status: 'available' as const }
          : d
      ));
    }
    // Assign the new driver
    return updateDriver(driverId, { 
      assigned_vehicle_id: vehicleId,
      status: vehicleId ? 'on_trip' : 'available'
    });
  }, [updateDriver]);

  return {
    drivers,
    loading,
    fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    assignVehicle
  };
}
