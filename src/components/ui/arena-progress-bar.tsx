import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ArenaProgressBarProps {
  label: string;
  value: number;
  max?: number;
  icon?: React.ReactNode;
  className?: string;
  showPercentage?: boolean;
}

export function ArenaProgressBar({ 
  label, 
  value, 
  max = 100, 
  icon,
  className,
  showPercentage = true
}: ArenaProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  // Calculate number of filled segments (out of 40 segments like in the image)
  const totalSegments = 40;
  const filledSegments = Math.round((percentage / 100) * totalSegments);

  return (
    <div className={cn("flex items-center gap-4 py-3", className)}>
      {/* Icon */}
      {icon && (
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-foreground/10 text-foreground">
          {icon}
        </div>
      )}

      {/* Label */}
      <div className="min-w-0 flex-shrink-0 w-24">
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 relative">
        <div className="h-6 rounded-full border-2 border-foreground/20 overflow-hidden bg-muted/30">
          <div className="h-full flex">
            {Array.from({ length: totalSegments }, (_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "flex-1 mx-px",
                  i < filledSegments ? "bg-foreground" : "bg-muted"
                )}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ 
                  delay: i * 0.02,
                  duration: 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Percentage */}
      {showPercentage && (
        <div className="min-w-0 flex-shrink-0 w-12 text-right">
          <span className="text-sm font-bold text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}