import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  showValue?: boolean;
  color?: "default" | "success" | "warning" | "error";
}

const colorClasses = {
  default: "bg-foreground",
  success: "bg-emerald-400",
  warning: "bg-amber-400", 
  error: "bg-rose-400"
};

export function ProgressBar({ 
  value, 
  max = 10, 
  label, 
  className, 
  showValue = true,
  color = "default" 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = () => {
    if (color !== "default") return color;
    if (value >= max * 0.8) return "success";
    if (value >= max * 0.6) return "warning";
    return "error";
  };

  const barColor = getColor();

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          {showValue && (
            <span className="text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            colorClasses[barColor]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}