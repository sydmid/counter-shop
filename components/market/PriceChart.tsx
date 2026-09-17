"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PriceChartProps {
  history: Array<{ date: string; price: number }>;
  currentPrice: number;
  predictedPrice7d?: number;
}

export function PriceChart({ history, currentPrice, predictedPrice7d }: PriceChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 text-xs">
        No price history recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full h-64 font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} />
          <YAxis
            stroke="#52525b"
            fontSize={10}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: 8 }}
            formatter={(value: any) => [formatCurrency(Number(value)), "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
          {predictedPrice7d && (
            <ReferenceLine
              y={predictedPrice7d}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{ value: "AI 7D Forecast", fill: "#10b981", fontSize: 10, position: "top" }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
