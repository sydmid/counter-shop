"use client";
import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, ShieldCheck, Hash, Plus, CheckCircle2, Lock } from "lucide-react";
import { TradeChat } from "../chat/TradeChat";

export function TradeRoom() {
  const [myInventory, setMyInventory] = useState<any[]>([]);
  const [partnerInventory, setPartnerInventory] = useState<any[]>([]);
  const [selectedMyItems, setSelectedMyItems] = useState<string[]>([]);
  const [selectedPartnerItems, setSelectedPartnerItems] = useState<string[]>([]);
  const [tradeMessage, setTradeMessage] = useState("");
  const [tradeStatus, setTradeStatus] = useState<string | null>(null);
  const [activeProof, setActiveProof] = useState<any>(null);

  useEffect(() => {
    async function loadInventories() {
      try {
        const res = await fetch("/api/inventory?appId=730");
        const json = await res.json();
        if (json.success && json.items) {
          setMyInventory(json.items.slice(0, 8));
          setPartnerInventory(json.items.slice(2, 7)); // Simulated partner items
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadInventories();
  }, []);

  const mySelectedTotal = myInventory
    .filter((i) => selectedMyItems.includes(i.inventoryId))
    .reduce((acc, i) => acc + i.item.currentPrice, 0);

  const partnerSelectedTotal = partnerInventory
    .filter((i) => selectedPartnerItems.includes(i.inventoryId))
    .reduce((acc, i) => acc + i.item.currentPrice, 0);

  const handleCreateTrade = async () => {
    if (!selectedMyItems.length && !selectedPartnerItems.length) {
      alert("Please select at least one item to propose trade.");
      return;
    }

    try {
      const res = await fetch("/api/trade/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "demo_user_1",
          receiverId: "demo_user_2",
          message: tradeMessage || "Counter-Shop Live P2P Trade",
          itemIdsToSend: selectedMyItems,
          itemIdsToReceive: selectedPartnerItems,
          clientSeed: "seed_client_custom_007",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveProof(data.tradeOffer);
        setTradeStatus("Trade offer dispatched! Server Seed committed with SHA-256.");
      }
    } catch (err: any) {
      alert("Trade error: " + err.message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Offered Items */}
        <Card className="border-blue-900/40 bg-zinc-950/80">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-bold text-blue-400">Your Trade Offer</CardTitle>
              <span className="font-mono text-xs font-bold text-white">
                Total: {formatCurrency(mySelectedTotal)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {myInventory.map((inv) => {
                const selected = selectedMyItems.includes(inv.inventoryId);
                return (
                  <div
                    key={inv.inventoryId}
                    onClick={() =>
                      setSelectedMyItems((prev) =>
                        selected ? prev.filter((id) => id !== inv.inventoryId) : [...prev, inv.inventoryId]
                      )
                    }
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      selected ? "border-blue-500 bg-blue-950/40" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <img src={inv.item.iconUrl} className="h-16 mx-auto object-contain" />
                    <p className="font-bold truncate mt-1 text-white">{inv.item.marketName}</p>
                    <p className="font-mono text-zinc-400">{formatCurrency(inv.item.currentPrice)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Middle Column: Trade Execution & Provably Fair Proof */}
        <div className="flex flex-col justify-between space-y-6">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center space-x-2 text-zinc-200">
                <ArrowLeftRight className="w-4 h-4 text-blue-400" />
                <span>Trade Negotiation Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Value Balance:</span>
                <span className={`font-mono font-bold ${mySelectedTotal >= partnerSelectedTotal ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {formatCurrency(mySelectedTotal - partnerSelectedTotal)}
                </span>
              </div>

              <Input
                placeholder="Attach an optional trade message..."
                value={tradeMessage}
                onChange={(e) => setTradeMessage(e.target.value)}
                className="text-xs bg-zinc-900 border-zinc-800"
              />

              <Button
                variant="glow"
                onClick={handleCreateTrade}
                className="w-full py-5 text-xs font-bold bg-blue-600 hover:bg-blue-500"
              >
                Send Secure P2P Trade Offer
              </Button>

              {tradeStatus && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded text-[11px] flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{tradeStatus}</span>
                </div>
              )}

              {activeProof && (
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded font-mono text-[10px] space-y-1">
                  <div className="text-zinc-400 font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    Provably Fair Verification Hash:
                  </div>
                  <div className="text-zinc-300 break-all">{activeProof.serverSeedHash}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integrated Socket.io Trade Room Chat */}
          <TradeChat room="P2P_EXCHANGE_ROOM_1" />
        </div>

        {/* Right Column: Partner's Requested Items */}
        <Card className="border-amber-900/40 bg-zinc-950/80">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-bold text-amber-400">Requested Items</CardTitle>
              <span className="font-mono text-xs font-bold text-white">
                Total: {formatCurrency(partnerSelectedTotal)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {partnerInventory.map((inv) => {
                const selected = selectedPartnerItems.includes(inv.inventoryId);
                return (
                  <div
                    key={inv.inventoryId}
                    onClick={() =>
                      setSelectedPartnerItems((prev) =>
                        selected ? prev.filter((id) => id !== inv.inventoryId) : [...prev, inv.inventoryId]
                      )
                    }
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      selected ? "border-amber-500 bg-amber-950/40" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <img src={inv.item.iconUrl} className="h-16 mx-auto object-contain" />
                    <p className="font-bold truncate mt-1 text-white">{inv.item.marketName}</p>
                    <p className="font-mono text-zinc-400">{formatCurrency(inv.item.currentPrice)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
