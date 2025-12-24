/**
 * Success Message Component
 * Reusable success message display component
 */

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export function SuccessMessage({ message, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-500",
        className
      )}
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

