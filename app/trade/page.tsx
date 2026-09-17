"use client";
import React from "react";
import { TradeRoom } from "@/components/trade/TradeRoom";
import { ArrowLeftRight, Shield } from "lucide-react";

export default function TradePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-500">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Live P2P Trade Room</h1>
          <p className="text-xs text-zinc-400">
            Escrow-free peer-to-peer item exchange with live negotiation chat and SHA-256 proofs.
          </p>
        </div>
      </div>

      <TradeRoom />
    </div>
  );
}
