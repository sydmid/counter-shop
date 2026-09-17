"use client";
import React, { useEffect, useState } from "react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, ArrowRight, Zap, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export function ArbitrageBotDashboard() {
  const [deals, setDeals] = useState<any[]>([]);
  const [autoExecute, setAutoExecute] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch("/api/arbitrage");
        const json = await res.json();
        if (json.success) setDeals(json.deals);
      } catch (err) {
        console.error(err);
      }
    }
    loadDeals();
    const interval = setInterval(loadDeals, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleExecute = (deal: any) => {
    const logMsg = `[${new Date().toLocaleTimeString()}] Executed arbitrage on ${deal.marketHashName} (Expected ROI: ${formatPercentage(deal.roiPercentage)})`;
    setLog((prev) => [logMsg, ...prev.slice(0, 10)]);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Bot Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-indigo-950/40 border border-blue-800/40 backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <span>BUFF163 vs Steam Market Arbitrage Bot</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time automated spread scanner comparing Chinese cash markets with Steam Community prices after 15% valve fee.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button
            variant={autoExecute ? "destructive" : "glow"}
            onClick={() => setAutoExecute(!autoExecute)}
            className="text-xs font-bold px-4"
          >
            {autoExecute ? "Stop Automated Bot" : "Activate Auto-Arbitrage"}
          </Button>
        </div>
      </div>

      {/* Arbitrage Deals Table */}
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-zinc-300">
            Live Arbitrage Opportunities Ranked by Net ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] font-mono text-zinc-500 uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-2">Item</th>
                  <th className="py-3 px-2">Game</th>
                  <th className="py-3 px-2">BUFF163 (Buy)</th>
                  <th className="py-3 px-2">Steam (Sell)</th>
                  <th className="py-3 px-2">Net Steam Cut (85%)</th>
                  <th className="py-3 px-2 text-emerald-400">Est. Profit</th>
                  <th className="py-3 px-2">ROI (%)</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-mono">
                {deals.map((deal) => {
                  const isPositive = deal.roiPercentage > 0;
                  return (
                    <tr key={deal.id} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="py-3 px-2 flex items-center space-x-2 font-sans font-semibold text-white">
                        <img src={deal.iconUrl} className="w-8 h-8 object-contain" />
                        <span className="truncate max-w-[180px]">{deal.marketHashName}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${deal.appId === 730 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {deal.appId === 730 ? "CS2" : "DOTA2"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-blue-300 font-bold">{formatCurrency(deal.buffPrice)}</td>
                      <td className="py-3 px-2 text-zinc-300">{formatCurrency(deal.steamPrice)}</td>
                      <td className="py-3 px-2 text-zinc-400">{formatCurrency(deal.steamNetPayout)}</td>
                      <td className="py-3 px-2 text-emerald-400 font-bold">{formatCurrency(deal.netProfit)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-bold ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {formatPercentage(deal.roiPercentage)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button
                          size="sm"
                          variant="glow"
                          onClick={() => handleExecute(deal)}
                          className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-500"
                        >
                          Execute Trade
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bot Execution Log Terminal */}
      {log.length > 0 && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300 space-y-1">
          <div className="text-zinc-500 font-bold mb-2">Automated Bot Audit Log:</div>
          {log.map((l, i) => (
            <div key={i} className="text-emerald-400">{l}</div>
          ))}
        </div>
      )}

    </div>
  );
}
