import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-foreground",
      "placeholder:text-muted-foreground",
      "transition-colors duration-150 hover:border-border-strong focus-visible:border-accent focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-45",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
