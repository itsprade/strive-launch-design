// ✅ Reusable Component: Page shell wrapper for consistent layout structure
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ShellProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "centered" | "sidebar";
}

export function Shell({
  children,
  variant = "default",
  className,
  ...props
}: ShellProps) {
  const variantClasses = {
    default: "min-h-screen w-full",
    centered: "min-h-screen w-full flex items-center justify-center",
    sidebar: "min-h-screen w-full flex",
  };

  return (
    <div
      className={cn(
        "bg-background text-foreground",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
