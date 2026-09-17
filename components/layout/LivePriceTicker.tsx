"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface TickerItem {
  id: string;
  name: string;
  price: number;
  change: number;
  appId: number;
  icon: string;
}

export function LivePriceTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch("/api/market/ticker");
        const json = await res.json();
        if (json.success) setItems(json.ticker);
      } catch (err) {
        console.error("Ticker fetch error", err);
      }
    }
    fetchTicker();
    const interval = setInterval(fetchTicker, 8000); // 8-second refresh
    return () => clearInterval(interval);
  }, []);

  if (!items.length) return null;

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800/80 py-1.5 overflow-hidden select-none">
      <div className="flex w-max animate-ticker space-x-8 hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, idx) => {
          const isUp = item.change >= 0;
          return (
            <div key={`${item.id}-${idx}`} className="flex items-center space-x-2 text-xs font-mono">
              <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${item.appId === 730 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                {item.appId === 730 ? "CS2" : "DOTA2"}
              </span>
              <span className="text-zinc-300 font-medium truncate max-w-[140px]">{item.name}</span>
              <span className="text-white font-bold">{formatCurrency(item.price)}</span>
              <span className={`flex items-center text-[11px] font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {formatPercentage(item.change)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
