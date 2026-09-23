"use client";
import React from "react";
import { formatCurrency, formatPercentage, getRarityColor, getConditionLabel, getTradeLockLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUpRight, TrendingUp, ShieldCheck, Lock, Unlock, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

interface ItemCardProps {
  item: any;
  onSelect?: (item: any) => void;
}

export function ItemCard({ item, onSelect }: ItemCardProps) {
  const rarityColor = getRarityColor(item.rarity);
  const { addToCart, items } = useCart();
  const isInCart = items.some((i) => (i.listingId || i.id) === (item.listingId || item.id));
  const conditionShort = getConditionLabel(item.condition);
  const tradeInfo = getTradeLockLabel(item.tradableAfter, item.isTradable ?? item.tradable);

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer"
    >
      {/* Top Badges & Rarity Glow */}
      <div className="flex items-center justify-between w-full z-10">
        <div className="flex items-center space-x-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: rarityColor, boxShadow: `0 0 8px ${rarityColor}` }}
          />
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            {item.subCategory || item.category}
          </span>
        </div>
        {conditionShort !== "N/A" && (
          <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-zinc-700 bg-zinc-950/80">
            {conditionShort}
          </Badge>
        )}
      </div>

      {/* Item Image with Radial Glow Backdrop */}
      <div className="relative mt-2 mb-4 flex items-center justify-center h-44 overflow-hidden">
        {/* Trade Lock Badge overlay */}
        <div className="absolute top-0 right-0 z-20">
          {tradeInfo.isTradable ? (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center space-x-1 px-2 py-0.5">
              <Unlock className="w-3 h-3" />
              <span>Tradable</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 flex items-center space-x-1 px-2 py-0.5">
              <Lock className="w-3 h-3" />
              <span>{tradeInfo.label}</span>
            </Badge>
          )}
        </div>
        <div
          className="absolute w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
          style={{ backgroundColor: rarityColor }}
        />
        <img
          src={item.iconUrl}
          alt={item.marketName}
          className="max-h-36 max-w-full object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Item Meta & Name */}
      <div className="space-y-1.5 z-10">
        <div className="flex items-center space-x-1">
          {item.isStatTrak && (
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">
              StatTrak™
            </span>
          )}
          {item.isSouvenir && (
            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1 rounded">
              Souvenir
            </span>
          )}
        </div>
        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
          {item.marketName}
        </h4>
      </div>

      {/* Float bar if available */}
      {item.floatValue !== undefined && item.floatValue !== null && (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Float</span>
            <span className="text-zinc-200">{item.floatValue.toFixed(4)}</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
              style={{ width: `${Math.min(100, item.floatValue * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Price & Action Buttons */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-400">Market Price</div>
          <div className="text-base font-black text-white font-mono">
            {formatCurrency(item.currentPrice)}
          </div>
        </div>

        <Button
          size="sm"
          variant={isInCart ? "outline" : "glow"}
          onClick={(e) => {
            e.stopPropagation();
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
            }
          }}
          className={`text-xs font-semibold px-3 py-1 ${!isInCart ? "bg-blue-600 hover:bg-blue-500" : ""}`}
          disabled={isInCart}
        >
          {isInCart ? (
            <>
              <ShoppingCart className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              In Cart
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>
      </div>
    </div>
  );
}
