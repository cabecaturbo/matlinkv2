import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground",
      "placeholder:text-muted-foreground",
      "transition-colors duration-150 hover:border-border-strong focus-visible:border-accent focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-45",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
