import { Route, Clock, Gauge, MapPin, Calendar, ChevronRight, Play, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TripTrack } from "@/hooks/useTripTracks";

interface TripHistoryPanelProps {
  trips: TripTrack[];
  selectedTrip: TripTrack | null;
  onSelectTrip: (trip: TripTrack) => void;
  loading: boolean;
  vehicleName?: string;
}

export function TripHistoryPanel({ trips, selectedTrip, onSelectTrip, loading, vehicleName }: TripHistoryPanelProps) {
  if (loading) {
    return (
      <div className="w-72 glass border-l border-border/50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading trips...</p>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="w-72 glass border-l border-border/50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Route className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No trip history</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Select a vehicle to view trips</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 glass border-l border-border/50 flex flex-col">
      <div className="p-3 border-b border-border/50">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Route className="w-4 h-4 text-primary" />Trip History
        </h3>
        {vehicleName && <p className="text-xs text-muted-foreground mt-0.5">{vehicleName}</p>}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isSelected={selectedTrip?.id === trip.id} onClick={() => onSelectTrip(trip)} />
          ))}
        </div>
      </ScrollArea>

      {selectedTrip && (
        <div className="p-3 border-t border-border/50 bg-secondary/20">
          <p className="text-xs font-medium mb-2">Selected Trip Details</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-background/50 rounded p-2"><p className="text-muted-foreground">Distance</p><p className="font-mono font-medium">{selectedTrip.total_distance} km</p></div>
            <div className="bg-background/50 rounded p-2"><p className="text-muted-foreground">Duration</p><p className="font-mono font-medium">{selectedTrip.duration_minutes} min</p></div>
            <div className="bg-background/50 rounded p-2"><p className="text-muted-foreground">Max Speed</p><p className="font-mono font-medium">{selectedTrip.max_speed} km/h</p></div>
            <div className="bg-background/50 rounded p-2"><p className="text-muted-foreground">Avg Speed</p><p className="font-mono font-medium">{selectedTrip.avg_speed} km/h</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip, isSelected, onClick }: { trip: TripTrack; isSelected: boolean; onClick: () => void }) {
  const formatTime = (time: string | null) => time ? new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className={`p-3 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-primary/10 border border-primary/30" : "bg-secondary/30 border border-transparent hover:bg-secondary/50"}`} onClick={onClick}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="outline" className={`text-[10px] ${trip.status === 'completed' ? 'border-success/30 text-success' : 'border-primary/30 text-primary'}`}>
          {trip.status === 'completed' ? <><CheckCircle className="w-3 h-3 mr-1" />Completed</> : <><Play className="w-3 h-3 mr-1" />In Progress</>}
        </Badge>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90 text-primary' : ''}`} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" /><span>{formatDate(trip.trip_date)}</span>
          <span className="text-border">•</span>
          <Clock className="w-3 h-3" /><span>{formatTime(trip.start_time)} - {formatTime(trip.end_time)}</span>
        </div>
        {trip.start_address && (
          <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" /><span className="truncate">{trip.start_address}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-muted-foreground"><Route className="w-3 h-3" />{trip.total_distance} km</span>
          <span className="flex items-center gap-1 text-muted-foreground"><Gauge className="w-3 h-3" />{trip.avg_speed} km/h avg</span>
        </div>
      </div>
    </div>
  );
}
