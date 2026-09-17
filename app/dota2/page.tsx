"use client";
import React, { useEffect, useState } from "react";
import { ItemCard } from "@/components/market/ItemCard";
import { MarketFilters } from "@/components/market/MarketFilters";
import { ItemDetailModal } from "@/components/market/ItemDetailModal";
import { Zap } from "lucide-react";

export default function Dota2Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [rarity, setRarity] = useState("ALL");
  const [condition, setCondition] = useState("ALL");
  const [sort, setSort] = useState("price_asc");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    async function loadDotaItems() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          appId: "570",
          q: search,
          category,
          rarity,
          condition,
          sort,
        });
        const res = await fetch(`/api/market/items?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) setItems(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const debounce = setTimeout(loadDotaItems, 200);
    return () => clearTimeout(debounce);
  }, [search, category, rarity, condition, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Dota 2 Cosmological Vault</h1>
          <p className="text-xs text-zinc-400">
            Arcanas, Immortals, Couriers, and Hero sets with instant P2P swap
          </p>
        </div>
      </div>

      <MarketFilters
        appId={570}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        rarity={rarity}
        onRarityChange={setRarity}
        condition={condition}
        onConditionChange={setCondition}
        sort={sort}
        onSortChange={setSort}
      />

      {loading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-sm">
          Querying Dota 2 Relics...
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 text-sm">
          No Dota 2 items found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={setSelectedItem}
              onInstantBuy={setSelectedItem}
            />
          ))}
        </div>
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onTradeOffer={() => {
            window.location.href = "/trade";
          }}
        />
      )}

    </div>
  );
}
