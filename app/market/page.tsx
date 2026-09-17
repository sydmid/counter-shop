"use client";
import React, { useEffect, useState } from "react";
import { ItemCard } from "@/components/market/ItemCard";
import { MarketFilters } from "@/components/market/MarketFilters";
import { ItemDetailModal } from "@/components/market/ItemDetailModal";
import { Flame } from "lucide-react";

export default function MarketPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [rarity, setRarity] = useState("ALL");
  const [condition, setCondition] = useState("ALL");
  const [sort, setSort] = useState("price_asc");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          appId: "730",
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
    const debounce = setTimeout(loadItems, 200);
    return () => clearTimeout(debounce);
  }, [search, category, rarity, condition, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Counter-Strike 2 Marketplace</h1>
          <p className="text-xs text-zinc-400">
            Real-time live prices, float inspection, and instant trade offers
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <MarketFilters
        appId={730}
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

      {/* Items Grid */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-sm">
          Searching Counter-Strike 2 catalog...
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 text-sm">
          No matching CS2 items found. Try relaxing your filters.
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

      {/* Item Detail & AI Price Forecast Modal */}
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
