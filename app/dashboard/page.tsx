"use client";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Coins, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft,
  Users
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState(730);
  const [tradeUrl, setTradeUrl] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.user);
          setTradeUrl(userData.user.tradeUrl || "");
        }

        const invRes = await fetch(`/api/inventory?appId=${activeGame}`);
        const invData = await invRes.json();
        if (invData.success) setInventory(invData.items || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [activeGame]);

  const handleSaveTradeUrl = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, tradeUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalInventoryVal = inventory.reduce((acc, i) => acc + i.item.currentPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile & Portfolio Top Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"}
            alt="User avatar"
            className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{user?.personaName || "Trader"}</h2>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                Steam Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">SteamID: {user?.steamId}</p>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
            <span className="text-zinc-500 block text-[11px]">Platform Balance</span>
            <span className="text-lg font-black text-emerald-400">
              {formatCurrency(user?.balance || 0)}
            </span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
            <span className="text-zinc-500 block text-[11px]">Total Inventory Value</span>
            <span className="text-lg font-black text-white">
              {formatCurrency(totalInventoryVal)}
            </span>
          </div>
        </div>

      </div>

      {/* Steam Trade URL Configuration */}
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-zinc-200">
            Steam Partner Trade URL Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-zinc-400">
            Required for bot automated trade offers. Your trade URL allows our automated bot cluster to deliver skins directly to your account.
          </p>
          <div className="flex gap-3">
            <Input
              value={tradeUrl}
              onChange={(e) => setTradeUrl(e.target.value)}
              placeholder="https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXX&token=YYYYYYYY"
              className="bg-zinc-900 border-zinc-800 text-xs font-mono"
            />
            <Button onClick={handleSaveTradeUrl} variant="glow" className="text-xs font-semibold px-6">
              Save URL
            </Button>
          </div>
          {saveSuccess && (
            <span className="text-emerald-400 text-xs font-mono">✓ Trade URL saved successfully.</span>
          )}
        </CardContent>
      </Card>

      {/* Inventory Browser */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-white">Your Synchronized Inventory</h3>
            <div className="flex space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveGame(730)}
                className={`px-3 py-1 rounded font-semibold ${activeGame === 730 ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
              >
                CS2
              </button>
              <button
                onClick={() => setActiveGame(570)}
                className={`px-3 py-1 rounded font-semibold ${activeGame === 570 ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
              >
                Dota 2
              </button>
            </div>
          </div>

          <Button size="sm" variant="outline" className="text-xs border-zinc-800">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Force Sync
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {inventory.map((inv) => (
            <div
              key={inv.inventoryId}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <img src={inv.item.iconUrl} className="h-20 mx-auto object-contain my-2" />
              <div className="space-y-1">
                <p className="font-bold text-xs text-white truncate">{inv.item.marketName}</p>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">{inv.item.condition !== 'NOT_APPLICABLE' ? inv.item.condition : 'Arcana'}</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(inv.item.currentPrice)}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3 text-[10px] h-7 border-zinc-800 hover:bg-zinc-800">
                List on Market
              </Button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
