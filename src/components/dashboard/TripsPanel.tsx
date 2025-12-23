import { 
  Calendar, 
  Clock, 
  MapPin, 
  Gauge, 
  Timer,
  Route,
  User,
  ChevronRight,
  Play,
  Square,
  Circle,
  List,
  BarChart3,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tripEvents = [
  {
    id: 1,
    type: "start",
    address: "Babna Gora 57, 1355 Dobrova-Polhov Gradec, Slovenia",
    time: "00:00:00 - 06:54:56",
    duration: "06:54:56",
  },
  {
    id: 2,
    type: "stop",
    address: "Babna Gora 64A, 1355 Dobrova-Polhov Gradec, Slovenia",
    time: "00:21:55 - 06:57:08",
    duration: "06:35:12",
    driver: "Driver",
  },
  {
    id: 3,
    type: "waypoint",
    address: "Babna Gora 57, 1355 Dobrova-Polhov Gradec, Slovenia",
    time: "06:54:56 - 07:57:24",
    stats: {
      maxSpeed: "91 km/h",
      avgSpeed: "35 km/h",
      distance: "36.91 km",
      duration: "01:02:28",
      idle: "00:14:07",
      score: "5.6",
    },
  },
];

export function TripsPanel() {
  return (
    <div className="h-72 glass border-t border-border/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Trips</h2>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
            Today
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Trip Stats */}
        <div className="w-80 border-r border-border/50 p-4 flex flex-col justify-center gap-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={Calendar} label="Date" value="2025-12-09" />
            <StatCard icon={Clock} label="Start" value="06:54:56" />
            <StatCard icon={Clock} label="End" value="16:44:59" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={Route} label="Distance" value="115.10 km" highlight />
            <StatCard icon={Timer} label="Trip Time" value="03:04:23" />
            <StatCard icon={Timer} label="Stops" value="20:52:36" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={Clock} label="Idle" value="00:37:29" />
            <StatCard icon={Gauge} label="Max" value="101 km/h" />
            <StatCard icon={Gauge} label="Avg" value="37 km/h" />
          </div>
        </div>

        {/* Trip Timeline */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {tripEvents.map((event, index) => (
              <TimelineEvent key={event.id} event={event} isLast={index === tripEvents.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  highlight 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg ${highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-mono font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function TimelineEvent({ 
  event, 
  isLast 
}: { 
  event: typeof tripEvents[0]; 
  isLast: boolean;
}) {
  const icons = {
    start: Play,
    stop: Square,
    waypoint: Circle,
  };
  const Icon = icons[event.type as keyof typeof icons];

  const colors = {
    start: "bg-success border-success/50",
    stop: "bg-destructive border-destructive/50",
    waypoint: "bg-primary border-primary/50",
  };

  return (
    <div className="flex gap-4 group">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${colors[event.type as keyof typeof colors]}`}>
          <Icon className="w-3 h-3 text-primary-foreground" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border/50 my-1" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="glass border-border/30 rounded-lg p-3 hover:border-primary/30 transition-colors cursor-pointer">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-foreground truncate">{event.address}</p>
              </div>
              <p className="text-xs text-muted-foreground">{event.time}</p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-[10px] border-border/50 font-mono">
                <Clock className="w-3 h-3 mr-1" />
                {event.duration}
              </Badge>
              {event.driver && (
                <Badge variant="outline" className="text-[10px] border-border/50">
                  <User className="w-3 h-3 mr-1" />
                  {event.driver}
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Stats row for waypoints */}
          {event.stats && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
              <MiniStat icon={Gauge} value={event.stats.maxSpeed} />
              <MiniStat icon={Gauge} value={event.stats.avgSpeed} />
              <MiniStat icon={Route} value={event.stats.distance} />
              <MiniStat icon={Timer} value={event.stats.duration} />
              <MiniStat icon={Clock} value={event.stats.idle} />
              <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">
                Score: {event.stats.score}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
      <Icon className="w-3 h-3" />
      <span className="font-mono">{value}</span>
    </div>
  );
}
