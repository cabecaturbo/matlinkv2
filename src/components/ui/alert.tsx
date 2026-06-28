import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({
  variant = "error",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "error" | "notice";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-3 py-2.5 text-sm",
        variant === "error"
          ? "border-danger/40 bg-danger/10 text-danger"
          : "border-accent/40 bg-accent/10 text-foreground",
        className,
      )}
      {...props}
    />
  );
}
