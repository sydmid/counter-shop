"use client";
import React from "react";
import { Search, Sliders, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MarketFiltersProps {
  appId: number;
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  rarity: string;
  onRarityChange: (rarity: string) => void;
  condition: string;
  onConditionChange: (cond: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export function MarketFilters({
  appId,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  rarity,
  onRarityChange,
  condition,
  onConditionChange,
  sort,
  onSortChange,
}: MarketFiltersProps) {
  const cs2Categories = ["ALL", "Weapon", "Knife", "Gloves", "Music Kit"];
  const dotaCategories = ["ALL", "Hero Item", "Courier", "Ward", "Music"];

  const categories = appId === 730 ? cs2Categories : dotaCategories;

  const rarities = [
    "ALL",
    "COVERT",
    "CLASSIFIED",
    "RESTRICTED",
    "MIL_SPEC",
    "IMMORTAL",
    "ARCANA",
    "MYTHICAL",
  ];

  const conditions = [
    { label: "All Wears", val: "ALL" },
    { label: "Factory New", val: "FACTORY_NEW" },
    { label: "Minimal Wear", val: "MINIMAL_WEAR" },
    { label: "Field-Tested", val: "FIELD_TESTED" },
    { label: "Well-Worn", val: "WELL_WORN" },
    { label: "Battle-Scarred", val: "BATTLE_SCARRED" },
  ];

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4 backdrop-blur-md">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={appId === 730 ? "Search CS2 skins, knives, gloves..." : "Search Dota 2 Arcanas, Immortals, Heroes..."}
            className="pl-9 bg-zinc-950 border-zinc-800"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-zinc-400" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-md px-3 py-2 outline-none"
          >
            <option value="price_asc">Price: Lowest first</option>
            <option value="price_desc">Price: Highest first</option>
            <option value="volume">Trading Volume</option>
            <option value="gainers">Top 24h Gainers</option>
            <option value="newest">Recently Listed</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span className="text-zinc-500 font-semibold mr-1">Category:</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={`px-3 py-1 rounded-md transition-colors ${
              category === c
                ? "bg-blue-600 text-white font-bold"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Secondary filter chips (Wear condition for CS2) */}
      {appId === 730 && (
        <div className="flex flex-wrap gap-1.5 items-center text-xs pt-1 border-t border-zinc-800/60">
          <span className="text-zinc-500 font-semibold mr-1">Wear:</span>
          {conditions.map((c) => (
            <button
              key={c.val}
              onClick={() => onConditionChange(c.val)}
              className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${
                condition === c.val
                  ? "bg-zinc-200 text-zinc-900 font-bold"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
