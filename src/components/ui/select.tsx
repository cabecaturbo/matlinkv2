import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground",
      "transition-colors duration-150 hover:border-border-strong focus-visible:border-accent focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-45",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
