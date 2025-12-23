import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { VehicleList, type Vehicle } from "@/components/dashboard/VehicleList";
import { MapboxMap } from "@/components/dashboard/MapboxMap";
import { TripsPanel } from "@/components/dashboard/TripsPanel";
import { AlertsPanel, type Alert } from "@/components/dashboard/AlertsPanel";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { GeofenceManager } from "@/components/dashboard/GeofenceManager";
import { DriverManager } from "@/components/dashboard/DriverManager";
import { TripHistoryPanel } from "@/components/dashboard/TripHistoryPanel";
import { useRealtimeVehicles } from "@/hooks/useRealtimeVehicles";
import { useTripTracks } from "@/hooks/useTripTracks";

// Sample vehicle data
const initialVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Grega",
    plate: "LJ-123-AB",
    driver: "Grega Novak",
    lat: 46.05,
    lng: 14.5,
    status: "moving",
    speed: 65,
    heading: 45,
    battery: 15.99,
    lastUpdate: "2 min ago",
    address: "Babna Gora 57, 1355 Dobrova-Polhov Gradec",
    tripDuration: "00:34:22",
    tripDistance: 20,
    maxSpeed: 80,
    totalDuration: "450:28:10",
    totalDistance: 19745,
    drivingScore: 5.3,
    harshAcceleration: 9.68,
    harshBraking: 7.40,
    harshCornering: 82.92,
    ignitionStatus: true,
    signalStrength: 100,
    tripCount: 1,
  },
  {
    id: "2",
    name: "Transport Van 1",
    plate: "VEH-2",
    driver: "Unknown Driver",
    lat: 46.08,
    lng: 14.52,
    status: "stopped",
    speed: 0,
    heading: 180,
    battery: 14.2,
    lastUpdate: "5 min ago",
    address: "Tržaška cesta 45, Ljubljana",
    tripDuration: "00:00:00",
    tripDistance: 0,
    maxSpeed: 95,
    totalDuration: "320:15:45",
    totalDistance: 15230,
    drivingScore: 7.8,
    harshAcceleration: 3.2,
    harshBraking: 4.5,
    harshCornering: 12.3,
    ignitionStatus: false,
    signalStrength: 80,
    tripCount: 0,
  },
  {
    id: "3",
    name: "Delivery Truck",
    plate: "VEH-3",
    driver: "Unknown Driver",
    lat: 46.03,
    lng: 14.48,
    status: "idle",
    speed: 0,
    heading: 90,
    battery: 13.8,
    lastUpdate: "1 min ago",
    address: "Slovenska cesta 12, Ljubljana",
    tripDuration: "00:05:30",
    tripDistance: 0,
    maxSpeed: 75,
    totalDuration: "580:42:18",
    totalDistance: 28450,
    drivingScore: 8.9,
    harshAcceleration: 1.5,
    harshBraking: 2.1,
    harshCornering: 5.8,
    ignitionStatus: true,
    signalStrength: 95,
    tripCount: 0,
  },
  {
    id: "4",
    name: "Service Vehicle",
    plate: "VEH-4",
    driver: "Unknown Driver",
    lat: 46.06,
    lng: 14.55,
    status: "moving",
    speed: 42,
    heading: 270,
    battery: 15.1,
    lastUpdate: "30 sec ago",
    address: "Dunajska cesta 88, Ljubljana",
    tripDuration: "01:12:45",
    tripDistance: 45,
    maxSpeed: 110,
    totalDuration: "890:33:22",
    totalDistance: 42180,
    drivingScore: 6.2,
    harshAcceleration: 12.4,
    harshBraking: 8.9,
    harshCornering: 25.6,
    ignitionStatus: true,
    signalStrength: 100,
    tripCount: 3,
  },
  {
    id: "5",
    name: "Manager Car",
    plate: "VEH-5",
    driver: "Unknown Driver",
    lat: 46.02,
    lng: 14.45,
    status: "moving",
    speed: 78,
    heading: 135,
    battery: 14.6,
    lastUpdate: "1 min ago",
    address: "Celovška cesta 33, Ljubljana",
    tripDuration: "00:48:15",
    tripDistance: 62,
    maxSpeed: 130,
    totalDuration: "1250:18:05",
    totalDistance: 68920,
    drivingScore: 4.5,
    harshAcceleration: 18.5,
    harshBraking: 15.2,
    harshCornering: 42.8,
    ignitionStatus: true,
    signalStrength: 85,
    tripCount: 2,
  },
];

// Sample alerts
const sampleAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    category: "speed",
    title: "Speeding Alert",
    message: "Vehicle exceeded 120 km/h in a 90 km/h zone",
    vehicleName: "Grega",
    vehicleId: "1",
    location: "A1 Highway, km 234",
    timestamp: "2 min ago",
    isRead: false,
    isResolved: false,
  },
  {
    id: "2",
    type: "warning",
    category: "geofence",
    title: "Geofence Exit",
    message: "Vehicle left designated work area",
    vehicleName: "Delivery Truck",
    vehicleId: "3",
    location: "Outside Ljubljana zone",
    timestamp: "15 min ago",
    isRead: false,
    isResolved: false,
  },
  {
    id: "3",
    type: "info",
    category: "maintenance",
    title: "Service Due",
    message: "Oil change scheduled in 500 km",
    vehicleName: "Transport Van 1",
    vehicleId: "2",
    location: "N/A",
    timestamp: "1 hour ago",
    isRead: true,
    isResolved: false,
  },
];

const Index = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGeofences, setShowGeofences] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  
  const { vehicles, updateVehiclePosition } = useRealtimeVehicles(initialVehicles);
  const { trips, selectedTrip, setSelectedTrip, loading: tripsLoading } = useTripTracks(selectedVehicleId);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Simulate real-time movement (local only, no database)
  useEffect(() => {
    const interval = setInterval(() => {
      for (const vehicle of vehicles) {
        if (vehicle.status === 'moving') {
          const newLat = vehicle.lat + (Math.random() - 0.5) * 0.002;
          const newLng = vehicle.lng + (Math.random() - 0.5) * 0.002;
          const newHeading = (vehicle.heading + (Math.random() - 0.5) * 20 + 360) % 360;
          const newSpeed = Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10);

          updateVehiclePosition({
            id: vehicle.id,
            lat: newLat,
            lng: newLng,
            heading: newHeading,
            speed: Math.round(newSpeed),
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicles, updateVehiclePosition]);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, isResolved: true } : a
    ));
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    setSelectedTrip(null);
  };

  const mapVehicles = vehicles.map(v => ({
    id: v.id,
    name: v.name,
    lat: v.lat,
    lng: v.lng,
    status: v.status,
    speed: v.speed,
    heading: v.heading,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onAnalyticsClick={() => setShowAnalytics(true)}
        onGeofenceClick={() => setShowGeofences(true)}
        onDriversClick={() => setShowDrivers(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <VehicleList 
          vehicles={vehicles}
          selectedId={selectedVehicleId}
          onSelect={handleVehicleSelect}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex">
            <MapboxMap 
              vehicles={mapVehicles}
              selectedVehicleId={selectedVehicleId}
              onVehicleClick={handleVehicleSelect}
              selectedTrip={selectedTrip}
            />
            
            {selectedVehicleId && (
              <TripHistoryPanel
                trips={trips}
                selectedTrip={selectedTrip}
                onSelectTrip={setSelectedTrip}
                loading={tripsLoading}
                vehicleName={selectedVehicle?.name}
              />
            )}
          </div>
          <TripsPanel />
        </div>
      </div>

      <AlertsPanel 
        alerts={alerts}
        onDismiss={handleDismissAlert}
        onResolve={handleResolveAlert}
        onVehicleClick={handleVehicleSelect}
      />

      <AnalyticsDashboard 
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <GeofenceManager
        isVisible={showGeofences}
        onClose={() => setShowGeofences(false)}
      />

      <DriverManager
        isVisible={showDrivers}
        onClose={() => setShowDrivers(false)}
        vehicles={vehicles}
      />
    </div>
  );
};

export default Index;
