import { useState, useCallback } from 'react';
import type { Vehicle } from '@/components/dashboard/VehicleList';

export function useRealtimeVehicles(initialVehicles: Vehicle[]) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  // Local update function (no database)
  const updateVehiclePosition = useCallback((vehicle: Partial<Vehicle> & { id: string }) => {
    setVehicles(prev => {
      const existingIndex = prev.findIndex(v => v.id === vehicle.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...vehicle,
          lastUpdate: 'Just now',
        };
        return updated;
      }
      return prev;
    });
  }, []);

  return { vehicles, setVehicles, updateVehiclePosition };
}
