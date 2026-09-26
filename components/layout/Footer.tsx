"use client";
import React from "react";
import Link from "next/link";
import { Shield, Github, Globe, Server, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 py-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white tracking-wider text-sm">SteamItemExchange (Counter-Shop)</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
            Ultra-high-performance open-source marketplace, automated trade-offer matching engine, and cross-platform arbitrage terminal for Counter-Strike 2 & Dota 2 items. Built on Next.js 15, PostgreSQL, Redis, and Socket.io.
          </p>
          <div className="flex items-center space-x-4 pt-1 text-zinc-500">
            <span className="flex items-center text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All Systems Operational
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">Sub-50ms API Latency</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Trading & Engine</h4>
          <ul className="space-y-2">
            <li><Link href="/market" className="hover:text-blue-400 transition-colors">CS2 Skin Exchange</Link></li>
            <li><Link href="/dota2" className="hover:text-blue-400 transition-colors">Dota 2 Immortals & Arcanas</Link></li>
            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog & Content</Link></li>
            <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Security & Support</h4>
          <ul className="space-y-2">
            <li><span className="text-zinc-400">Provably Fair SHA-256</span></li>
            <li><Link href="/support" className="hover:text-blue-400 transition-colors">Support</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px]">
        <p>© 2026 Counter-Shop (SteamItemExchange). Powered by Valve Steam Web API.</p>
        <p className="mt-2 sm:mt-0">Not affiliated with or endorsed by Valve Corporation.</p>
      </div>
    </footer>
  );
}
