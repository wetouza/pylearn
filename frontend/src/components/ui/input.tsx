import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm transition-all duration-200",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50",
            "hover:border-white/20 hover:bg-white/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

