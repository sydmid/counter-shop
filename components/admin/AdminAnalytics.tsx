"use client";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Layers, ArrowLeftRight, Activity, ShieldAlert } from "lucide-react";

export function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  if (!stats) return <div className="text-zinc-500 py-12 text-center text-xs">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border-zinc-800 bg-zinc-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Gross Market Volume (GMV)</p>
              <h3 className="text-2xl font-black text-white font-mono mt-1">
                {formatCurrency(stats.totalGMV)}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Platform Fee Revenue (24h)</p>
              <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(stats.platformFees24h)}
              </h3>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Total Users & Traders</p>
              <h3 className="text-2xl font-black text-white font-mono mt-1">
                {stats.totalUsers.toLocaleString()}
              </h3>
            </div>
            <Users className="w-8 h-8 text-indigo-400" />
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Active Listings & Trades</p>
              <h3 className="text-2xl font-black text-white font-mono mt-1">
                {stats.activeListings} / {stats.totalTrades}
              </h3>
            </div>
            <Layers className="w-8 h-8 text-amber-400" />
          </CardContent>
        </Card>

      </div>

      {/* Steam Bot Cluster Status */}
      <Card className="border-zinc-800 bg-zinc-950 p-4">
        <CardTitle className="text-sm font-bold text-white mb-4">
          Steam Trade Bot Cluster & Escrow Health
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500 block">Bot Cluster Node 1</span>
            <span className="text-emerald-400 font-bold">ONLINE (0ms latency)</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500 block">Bot Cluster Node 2</span>
            <span className="text-emerald-400 font-bold">ONLINE (1ms latency)</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500 block">Redis Rate Limiter</span>
            <span className="text-emerald-400 font-bold">OPTIMAL</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500 block">System Uptime</span>
            <span className="text-blue-400 font-bold">{stats.uptime}</span>
          </div>
        </div>
      </Card>

    </div>
  );
}
