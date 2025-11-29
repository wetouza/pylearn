"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showValue?: boolean;
  variant?: "default" | "gradient" | "glow";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showValue, variant = "default", ...props }, ref) => {
  const indicatorVariants = {
    default: "bg-primary",
    gradient: "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink",
    glow: "bg-gradient-to-r from-neon-cyan to-neon-purple shadow-glow",
  };

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
            indicatorVariants[variant],
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute -top-6 right-0 text-xs text-muted-foreground">
          {value}%
        </span>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

