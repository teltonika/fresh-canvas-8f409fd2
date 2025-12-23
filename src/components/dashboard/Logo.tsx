import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", pin: "w-4 h-4", dot: "w-1.5 h-1.5", ring: "w-6 h-6" },
    md: { container: "w-10 h-10", pin: "w-5 h-5", dot: "w-2 h-2", ring: "w-7 h-7" },
    lg: { container: "w-14 h-14", pin: "w-7 h-7", dot: "w-3 h-3", ring: "w-10 h-10" },
  };

  const s = sizes[size];

  return (
    <div className={cn("relative group", s.container, className)}>
      {/* Outer glow ring - animated */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 blur-md animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Main container */}
      <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden shadow-lg">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 animate-shimmer" />
        
        {/* GPS Pin Icon - Custom SVG */}
        <svg
          viewBox="0 0 24 24"
          className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground drop-shadow-lg", s.pin)}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location pin */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="currentColor"
            className="drop-shadow-sm"
          />
          {/* Inner circle */}
          <circle
            cx="12"
            cy="9"
            r="2.5"
            className="fill-primary"
          />
          {/* Satellite signal rings */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            className="opacity-40"
            fill="none"
          />
        </svg>
        
        {/* Orbiting satellite dot */}
        <div className="absolute top-1 right-1">
          <div className={cn("rounded-full bg-white shadow-lg animate-bounce-subtle", s.dot)} />
        </div>
        
        {/* Signal waves */}
        <div className="absolute -bottom-1 -right-1 opacity-50">
          <div className="w-3 h-3 border border-primary-foreground/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      </div>
      
      {/* Corner accent */}
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}
