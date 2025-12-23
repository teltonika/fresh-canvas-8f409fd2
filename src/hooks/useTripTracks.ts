import { useState, useCallback } from 'react';

export interface TripCoordinate {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
}

export interface TripTrack {
  id: string;
  vehicle_id: string;
  driver_id: string | null;
  trip_date: string;
  start_time: string | null;
  end_time: string | null;
  start_address: string | null;
  end_address: string | null;
  total_distance: number;
  max_speed: number;
  avg_speed: number;
  duration_minutes: number;
  coordinates: TripCoordinate[];
  status: 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

// Sample trips data
const sampleTrips: TripTrack[] = [
  {
    id: '1',
    vehicle_id: '1',
    driver_id: null,
    trip_date: new Date().toISOString().split('T')[0],
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date().toISOString(),
    start_address: 'Babna Gora 57, Dobrova-Polhov Gradec',
    end_address: 'Ljubljana Center',
    total_distance: 36.5,
    max_speed: 92,
    avg_speed: 45,
    duration_minutes: 48,
    status: 'completed',
    created_at: new Date().toISOString(),
    coordinates: [
      { lat: 46.05, lng: 14.5, timestamp: new Date(Date.now() - 3600000).toISOString(), speed: 0 },
      { lat: 46.055, lng: 14.51, timestamp: new Date(Date.now() - 3300000).toISOString(), speed: 45 },
      { lat: 46.06, lng: 14.52, timestamp: new Date(Date.now() - 3000000).toISOString(), speed: 62 },
      { lat: 46.065, lng: 14.525, timestamp: new Date(Date.now() - 2700000).toISOString(), speed: 78 },
      { lat: 46.07, lng: 14.53, timestamp: new Date(Date.now() - 2400000).toISOString(), speed: 85 },
      { lat: 46.075, lng: 14.535, timestamp: new Date(Date.now() - 2100000).toISOString(), speed: 92 },
      { lat: 46.08, lng: 14.54, timestamp: new Date(Date.now() - 1800000).toISOString(), speed: 88 },
      { lat: 46.085, lng: 14.545, timestamp: new Date(Date.now() - 1500000).toISOString(), speed: 72 },
      { lat: 46.09, lng: 14.55, timestamp: new Date(Date.now() - 1200000).toISOString(), speed: 55 },
      { lat: 46.095, lng: 14.555, timestamp: new Date(Date.now() - 900000).toISOString(), speed: 38 },
      { lat: 46.1, lng: 14.56, timestamp: new Date(Date.now() - 600000).toISOString(), speed: 25 },
      { lat: 46.105, lng: 14.565, timestamp: new Date().toISOString(), speed: 0 },
    ]
  },
  {
    id: '2',
    vehicle_id: '1',
    driver_id: null,
    trip_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    start_time: new Date(Date.now() - 90000000).toISOString(),
    end_time: new Date(Date.now() - 86400000).toISOString(),
    start_address: 'Ljubljana Airport',
    end_address: 'Babna Gora 57, Dobrova-Polhov Gradec',
    total_distance: 28.3,
    max_speed: 110,
    avg_speed: 52,
    duration_minutes: 32,
    status: 'completed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    coordinates: [
      { lat: 46.22, lng: 14.46, timestamp: new Date(Date.now() - 90000000).toISOString(), speed: 0 },
      { lat: 46.18, lng: 14.47, timestamp: new Date(Date.now() - 89000000).toISOString(), speed: 65 },
      { lat: 46.14, lng: 14.48, timestamp: new Date(Date.now() - 88000000).toISOString(), speed: 95 },
      { lat: 46.1, lng: 14.49, timestamp: new Date(Date.now() - 87500000).toISOString(), speed: 110 },
      { lat: 46.07, lng: 14.5, timestamp: new Date(Date.now() - 87000000).toISOString(), speed: 88 },
      { lat: 46.05, lng: 14.5, timestamp: new Date(Date.now() - 86400000).toISOString(), speed: 0 },
    ]
  }
];

export function useTripTracks(vehicleId?: string) {
  const [trips, setTrips] = useState<TripTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripTrack | null>(null);

  // Load trips for vehicle (mock data)
  const fetchTrips = useCallback((vId: string) => {
    setLoading(true);
    // Filter sample trips by vehicle ID
    const vehicleTrips = sampleTrips.filter(t => t.vehicle_id === vId);
    setTrips(vehicleTrips);
    if (vehicleTrips.length > 0 && !selectedTrip) {
      setSelectedTrip(vehicleTrips[0]);
    }
    setLoading(false);
  }, [selectedTrip]);

  // Fetch when vehicleId changes
  useState(() => {
    if (vehicleId) {
      fetchTrips(vehicleId);
    } else {
      setTrips([]);
      setSelectedTrip(null);
    }
  });

  const addCoordinateToTrip = useCallback((tripId: string, coordinate: TripCoordinate) => {
    setTrips(prev => prev.map(t => 
      t.id === tripId 
        ? { ...t, coordinates: [...t.coordinates, coordinate] } 
        : t
    ));
    return true;
  }, []);

  const createTrip = useCallback((vehicleId: string, driverId?: string) => {
    const newTrip: TripTrack = {
      id: Date.now().toString(),
      vehicle_id: vehicleId,
      driver_id: driverId || null,
      trip_date: new Date().toISOString().split('T')[0],
      start_time: new Date().toISOString(),
      end_time: null,
      start_address: null,
      end_address: null,
      total_distance: 0,
      max_speed: 0,
      avg_speed: 0,
      duration_minutes: 0,
      coordinates: [],
      status: 'in_progress',
      created_at: new Date().toISOString(),
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  }, []);

  const completeTrip = useCallback((tripId: string, endAddress?: string) => {
    setTrips(prev => prev.map(t => 
      t.id === tripId 
        ? { ...t, status: 'completed' as const, end_time: new Date().toISOString(), end_address: endAddress || null } 
        : t
    ));
    return true;
  }, []);

  return {
    trips,
    loading,
    selectedTrip,
    setSelectedTrip,
    fetchTrips,
    createTrip,
    addCoordinateToTrip,
    completeTrip
  };
}
