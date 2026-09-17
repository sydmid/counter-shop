"use client";
import React from "react";
import Link from "next/link";
import { 
  Zap, 
  ShieldCheck, 
  ArrowLeftRight, 
  TrendingUp, 
  Activity, 
  Lock, 
  Cpu, 
  ChevronRight,
  Flame,
  Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        
        {/* Glowing backdrop circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Next.js 15 + Redis Live Trade Engine v1.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Ultra-High-Speed Trading for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
              CS2 & Dota 2 Items
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The next-generation open-source trading marketplace. Instant trade offer creation, cross-platform BUFF163 arbitrage scanner, AI price predictions, and provably fair cryptographic guarantees.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/market">
              <Button size="lg" variant="glow" className="bg-blue-600 hover:bg-blue-500 text-sm font-bold px-8">
                Explore CS2 Market <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/arbitrage">
              <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-900 text-sm font-semibold">
                <Activity className="w-4 h-4 mr-2 text-emerald-400" />
                Launch Arbitrage Bot
              </Button>
            </Link>
            <Link href="/trade">
              <Button size="lg" variant="secondary" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-sm font-semibold">
                <ArrowLeftRight className="w-4 h-4 mr-2 text-blue-400" />
                P2P Trade Room
              </Button>
            </Link>
          </div>

        </div>

      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">&lt;50ms Response Latency</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Powered by Redis sliding-window caching, server streaming, and sub-10ms Socket.io trade broadcasts for institutional-grade responsiveness.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">BUFF163 Arbitrage Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Detects real-time price inefficiencies across Asian cash markets and Steam Community Market with automatic 15% fee factoring and automated execution.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Provably Fair Trade Hashes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every trade is bound by SHA-256 server seed commits and client nonces, guaranteeing complete mathematical transparency and auditability.
            </p>
          </div>

        </div>
      </section>

      {/* Live Market Teaser */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Featured High-Tier Skins</h2>
            <p className="text-xs text-zinc-400">Live CS2 Covert & Dota 2 Arcana liquid items</p>
          </div>
          <Link href="/market" className="text-xs font-semibold text-blue-400 hover:underline">
            View all items →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-rose-500">CS2 Covert</span>
              <span className="font-mono text-zinc-400">FN</span>
            </div>
            <img src="https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fzj9V7Pp8j-3I4IG72ADk-ERkY277cYScewE5Y1zS-VO8yO26g5fu7pvOnCdj7ykqs3nfyhC1hktIcKUx0jC2zJ-7/360fx360f" className="h-28 mx-auto object-contain" />
            <div className="font-bold text-sm text-white truncate">AWP | Dragon Lore</div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs">
              <span className="font-mono font-bold text-white text-base">$9,450.00</span>
              <span className="text-emerald-400 font-bold">+2.45%</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-rose-500">CS2 Covert</span>
              <span className="font-mono text-zinc-400">FN</span>
            </div>
            <img src="https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbssLQJf1f_BYQJB-dmlq42Ok_7hNr7Zg2lfuPp9g-7J4cKi31e3qBFqamzwLNSddlA2YgnT_FG8x-3p1JXtvpjLznpgvnQrsSrelgv330_Z8D4TcA/360fx360f" className="h-28 mx-auto object-contain" />
            <div className="font-bold text-sm text-white truncate">★ M9 Bayonet | Doppler</div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs">
              <span className="font-mono font-bold text-white text-base">$1,250.00</span>
              <span className="text-emerald-400 font-bold">+4.80%</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-amber-500">Dota 2 Immortal</span>
              <span className="font-mono text-zinc-400">Clean</span>
            </div>
            <img src="https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k0/360fx360f" className="h-28 mx-auto object-contain" />
            <div className="font-bold text-sm text-white truncate">Dragonclaw Hook</div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs">
              <span className="font-mono font-bold text-white text-base">$195.00</span>
              <span className="text-emerald-400 font-bold">+1.80%</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald-400">Dota 2 Arcana</span>
              <span className="font-mono text-zinc-400">Exalted</span>
            </div>
            <img src="https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k1/360fx360f" className="h-28 mx-auto object-contain" />
            <div className="font-bold text-sm text-white truncate">Manifold Paradox</div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs">
              <span className="font-mono font-bold text-white text-base">$38.50</span>
              <span className="text-rose-400 font-bold">-0.80%</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
