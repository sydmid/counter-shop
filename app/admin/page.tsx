"use client";
import React from "react";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { SlidersHorizontal } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-500">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Admin Command Center</h1>
          <p className="text-xs text-zinc-400">
            Live platform metrics, trade volumes, bot cluster nodes, and settlement analytics.
          </p>
        </div>
      </div>

      <AdminAnalytics />
    </div>
  );
}
