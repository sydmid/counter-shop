"use client";
import React, { useEffect, useState } from "react";
import { formatCurrency, formatPercentage, getRarityColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceChart } from "./PriceChart";
import { 
  X, 
  BrainCircuit, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Info
} from "lucide-react";

interface ItemDetailModalProps {
  item: any;
  onClose: () => void;
  onTradeOffer: (item: any) => void;
}

import { View, ShoppingCart } from "lucide-react";
import { getTradeLockLabel } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";

export function ItemDetailModal({ item, onClose, onTradeOffer }: ItemDetailModalProps) {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buyStatus, setBuyStatus] = useState<string | null>(null);
  const [isPreview360, setIsPreview360] = useState(false);
  const { addToCart, items } = useCart();
  const isInCart = items.some((i) => (i.listingId || i.id) === (item.listingId || item.id));

  useEffect(() => {
    async function fetchPrediction() {
      try {
        const res = await fetch(`/api/market/predict?itemId=${item.id}`);
        const data = await res.json();
        if (data.success) {
          setPredictionData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrediction();
  }, [item.id]);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({
        id: item.id,
        listingId: item.listingId,
        marketName: item.marketName,
        iconUrl: item.iconUrl,
        currentPrice: item.currentPrice,
        isTradable: item.isTradable ?? item.tradable,
        tradableAfter: item.tradableAfter,
      });
      onClose();
    }
  };

  const rarityColor = getRarityColor(item.rarity);
  const tradeInfo = getTradeLockLabel(item.tradableAfter, item.isTradable ?? item.tradable);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: rarityColor }} />
            <span className="text-xs font-mono uppercase text-zinc-400">
              {item.appId === 730 ? "Counter-Strike 2" : "Dota 2"} • {item.rarity}
            </span>
          </div>

          <div className="group relative flex items-center">
            {tradeInfo.isTradable ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center space-x-1.5 px-3 py-1">
                <Unlock className="w-4 h-4" />
                <span>Tradable</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 flex items-center space-x-1.5 px-3 py-1 cursor-help">
                <Lock className="w-4 h-4" />
                <span>{tradeInfo.label}</span>
                <Info className="w-3 h-3 ml-1 text-amber-500/70" />
              </Badge>
            )}

            {/* Tooltip for Trade Hold */}
            {!tradeInfo.isTradable && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-xs text-zinc-300">
                <div className="font-bold text-amber-400 mb-1">Mandatory 7-Day Steam Trade Hold</div>
                Items traded recently are subject to Valve&apos;s 7-day trade protection rule. This item will auto-deliver once the hold expires.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image, stickers, details */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 relative">
            <div className={`relative transition-transform duration-700 ${isPreview360 ? 'scale-x-[-1]' : ''}`}>
              <img
                src={item.iconUrl}
                alt={item.marketName}
                className="max-h-60 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300"
              onClick={() => setIsPreview360(!isPreview360)}
            >
              <View className="w-4 h-4 mr-2" />
              {isPreview360 ? "Exit 360° Wear Preview" : "360° Wear Preview"}
            </Button>
            <h3 className="text-xl font-black text-center mt-4 text-white">
              {item.marketName}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">{item.marketHashName}</p>

            <div className="mt-6 w-full grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg">
                <span className="text-zinc-500 block">Current Market</span>
                <span className="font-bold text-white text-sm">{formatCurrency(item.currentPrice)}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg">
                <span className="text-zinc-500 block">BUFF163 Cash</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {item.buff163Price ? formatCurrency(item.buff163Price) : "N/A"}
                </span>
              </div>
            </div>

            {/* Instant Actions */}
            <div className="w-full mt-6 space-y-2">
              <Button
                onClick={handleAddToCart}
                variant={isInCart ? "outline" : "glow"}
                disabled={isInCart}
                className={`w-full py-6 font-bold text-sm ${!isInCart ? "bg-blue-600 hover:bg-blue-500" : ""}`}
              >
                {isInCart ? (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2 text-emerald-400" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart for {formatCurrency(item.currentPrice)}
                  </>
                )}
              </Button>
              <Button
                onClick={() => onTradeOffer(item)}
                variant="outline"
                className="w-full py-5 text-xs text-zinc-300 border-zinc-700 hover:bg-zinc-800"
              >
                Initiate P2P Item Swap
              </Button>
            </div>

            {buyStatus && (
              <div className="mt-4 p-3 w-full rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{buyStatus}</span>
              </div>
            )}
          </div>

          {/* Right Column: AI Predictions & Chart */}
          <div className="space-y-6">
            
            {/* Price Prediction Card */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm text-indigo-200">AI Skin Price Forecaster</span>
                </div>
                {predictionData && (
                  <Badge variant="outline" className="text-[10px] font-mono border-indigo-400 text-indigo-300">
                    Confidence: {predictionData.prediction.confidenceScore}%
                  </Badge>
                )}
              </div>

              {predictionData ? (
                <div className="grid grid-cols-3 gap-3 mt-4 text-center font-mono">
                  <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">7D Target</span>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(predictionData.prediction.predictedPrice7d)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">Expected Trend</span>
                    <span className={`text-sm font-bold ${predictionData.prediction.trend === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {predictionData.prediction.trend}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">Swing</span>
                    <span className={`text-sm font-bold ${predictionData.prediction.predictedChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercentage(predictionData.prediction.predictedChangePct)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-zinc-500">Calculating neural time-series forecast...</div>
              )}
            </div>

            {/* Historical Price Chart */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-zinc-300">30-Day Price Movement</span>
                <span className="text-[11px] font-mono text-zinc-500">USD Median Daily</span>
              </div>
              <PriceChart
                history={predictionData?.history || []}
                currentPrice={item.currentPrice}
                predictedPrice7d={predictionData?.prediction?.predictedPrice7d}
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
