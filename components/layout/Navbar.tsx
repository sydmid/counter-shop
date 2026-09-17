"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Flame, 
  ShieldCheck, 
  ArrowLeftRight, 
  Zap, 
  LayoutDashboard, 
  Coins, 
  LogIn, 
  Activity,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  const navLinks = [
    { label: "CS2 Market", href: "/market", icon: Flame },
    { label: "Dota 2 Hub", href: "/dota2", icon: Zap },
    { label: "P2P Trading", href: "/trade", icon: ArrowLeftRight },
    { label: "Arbitrage Bot", href: "/arbitrage", icon: Activity },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Admin", href: "/admin", icon: SlidersHorizontal },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-blue-500 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-wider text-lg bg-gradient-to-r from-white via-zinc-200 to-blue-400 bg-clip-text text-transparent">
              STEAM<span className="text-blue-500">EXCHANGE</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono -mt-1 tracking-widest uppercase">
              Counter-Shop Engine
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Account / Steam Auth Button */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 p-1.5 pr-3 rounded-full">
              <img
                src={user.avatar}
                alt={user.personaName}
                className="w-8 h-8 rounded-full border border-blue-500/40"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">
                  {user.personaName}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center">
                  <Coins className="w-2.5 h-2.5 mr-1" />
                  {formatCurrency(user.balance)}
                </span>
              </div>
            </div>
          ) : (
            <a href="/api/auth/steam">
              <Button variant="glow" className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-zinc-800 text-white text-xs px-4">
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign in with Steam</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
