/**
 * Error Message Component
 * Reusable error message display component
 */

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: "default" | "destructive" | "warning";
}

const variantClasses = {
  default: "bg-muted text-foreground",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
};

export function ErrorMessage({
  message,
  className,
  variant = "destructive",
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border p-3 text-sm",
        variantClasses[variant],
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

