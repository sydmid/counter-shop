"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "cs2";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-blue-600 text-white shadow hover:bg-blue-700",
    secondary: "border-transparent bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
    destructive: "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
    outline: "text-zinc-300 border border-zinc-700",
    success: "border-transparent bg-emerald-600 text-white shadow",
    cs2: "border-transparent bg-amber-500/20 text-amber-400 border border-amber-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
