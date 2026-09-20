"use client";
import React, { useEffect, useState } from "react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ShieldCheck, Info, CheckCircle2, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ItemCard } from "@/components/market/ItemCard";

export default function SellPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [listPrice, setListPrice] = useState<string>("");
  const [listStatus, setListStatus] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // Hardcode demo user's steamId for demonstration (from seed.ts)
  const demoSteamId = "76561198012345678";

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch(`/api/inventory?steamId=${demoSteamId}`);
        const data = await res.json();
        if (data.success) {
          // Filter out items already listed if needed, or just show all
          setInventory(data.items);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        // Simulate KYC verification for demo
        setIsVerified(true);
      }
    }
    fetchInventory();
  }, []);

  const feeRate = parseFloat(listPrice) > 1000 ? 0.06 : 0.08;
  const youReceive = parseFloat(listPrice) > 0 ? parseFloat(listPrice) * (1 - feeRate) : 0;

  const handleListForSale = async () => {
    if (!selectedItem || !listPrice || !isVerified) return;
    setListStatus("listing...");

    try {
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryItemId: selectedItem.inventoryId,
          price: parseFloat(listPrice),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setListStatus("success");
        setTimeout(() => {
          setListStatus(null);
          setSelectedItem(null);
          setListPrice("");
        }, 3000);
      } else {
        setListStatus("error");
      }
    } catch (err) {
      console.error(err);
      setListStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Adyen KYC Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-white">Sell CS2 Skins</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Deposit to our Steam Bot. Fast direct-to-bank payouts via SEPA/ACH.
          </p>
        </div>

        {/* Adyen KYC Status */}
        <div className={`flex items-center space-x-3 border px-4 py-3 rounded-xl ${isVerified ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-amber-950/30 border-amber-500/30'}`}>
          <div className={`p-2 rounded-full ${isVerified ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
            <ShieldCheck className={`w-5 h-5 ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div>
            <div className={`text-xs font-semibold flex items-center space-x-1 ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span>{isVerified ? 'KYC Identity Verified (Simulated)' : 'KYC Verification Required'}</span>
              {isVerified && <CheckCircle2 className="w-3 h-3" />}
            </div>
            <div className="text-[10px] text-zinc-400">Powered by Adyen • Bank Linked (SEPA)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Inventory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-500" />
              Your Steam Inventory
            </h2>
            <Badge variant="outline" className="text-zinc-400 border-zinc-700">
              {inventory.length} Items Available
            </Badge>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                Loading Steam Inventory...
              </div>
            ) : inventory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                No tradable items found in your inventory.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {inventory.map((inv) => (
                  <div
                    key={inv.inventoryId}
                    className={`relative rounded-xl border-2 transition-all cursor-pointer ${
                      selectedItem?.inventoryId === inv.inventoryId
                        ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-950/20"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedItem(inv);
                      // Default listing price to current market median
                      setListPrice(inv.item.currentPrice.toString());
                    }}
                  >
                    <ItemCard
                      item={{
                        ...inv.item,
                        floatValue: inv.floatValue,
                        tradableAfter: inv.item.tradableAfter,
                        isTradable: inv.isTradable,
                      }}
                      onSelect={() => {}}
                    />
                    {selectedItem?.inventoryId === inv.inventoryId && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-30">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Listing Controls */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sticky top-8">
            <h3 className="text-lg font-bold text-white mb-6">Listing Details</h3>

            {!selectedItem ? (
              <div className="text-center py-8 text-sm text-zinc-500 border border-dashed border-zinc-700 rounded-xl">
                Select an item from your inventory to list for sale.
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center space-x-4">
                  <img src={selectedItem.item.iconUrl} alt="Item" className="w-16 h-16 object-contain" />
                  <div>
                    <div className="text-xs text-zinc-400 font-mono">{selectedItem.item.marketHashName}</div>
                    <div className="text-sm font-bold text-white">Suggested: {formatCurrency(selectedItem.item.currentPrice)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Set Your Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 font-bold">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="pl-8 bg-zinc-950 border-zinc-700 text-white text-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Listing Price</span>
                    <span className="font-mono text-zinc-300">${parseFloat(listPrice || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 flex items-center">
                      Seller Fee
                      <div className="group relative ml-1 cursor-help">
                        <Info className="w-3.5 h-3.5 text-zinc-500" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-zinc-800 text-xs text-zinc-300 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          Standard fee is 8%. Reduced to 6% for items priced over $1000.
                        </div>
                      </div>
                    </span>
                    <span className="font-mono text-amber-400">-{formatPercentage(feeRate * 100)}</span>
                  </div>
                  <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <span className="font-bold text-white">You Receive</span>
                    <span className="font-mono text-xl font-black text-emerald-400">
                      {formatCurrency(youReceive)}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-200/80">
                    <strong className="text-amber-400">Trade Hold Notice:</strong> Once deposited, this item will be subject to Valve&apos;s 7-day trade hold. It can be purchased instantly, but auto-delivery will wait until the hold expires.
                  </div>
                </div>

                <Button
                  onClick={handleListForSale}
                  disabled={listStatus === "listing..." || parseFloat(listPrice || "0") <= 0 || !isVerified}
                  className="w-full font-bold py-6 text-base bg-blue-600 hover:bg-blue-500"
                >
                  {listStatus === "listing..." ? "Creating Listing & Bot Trade..." : "Deposit & List for Sale"}
                </Button>

                {listStatus === "success" && (
                  <div className="text-center text-sm text-emerald-400 flex justify-center items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Listing active! Bot offer sent.</span>
                  </div>
                )}
                {listStatus === "error" && (
                  <div className="text-center text-sm text-rose-400">
                    Failed to create listing. Please try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
