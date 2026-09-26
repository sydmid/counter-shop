"use client";
import React from "react";
import { BookOpen } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Ultimate Guide to CS Skins",
    category: "Skins",
    date: "Sep 20, 2026",
    excerpt: "Everything you need to know about wear, pattern templates, and float values.",
    image: "https://images.unsplash.com/photo-1614064641913-a520faff82b6?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Skins as Digital Investments",
    category: "Market",
    date: "Sep 22, 2026",
    excerpt: "Analyzing the historical trends of rare items and their potential future value.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=2574&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "IEM Cologne 2026 Wrap-Up",
    category: "Esports",
    date: "Sep 25, 2026",
    excerpt: "A deep dive into the biggest trades and skin spotlights during the tournament.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-500">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Skinport Blog</h1>
          <p className="text-sm text-zinc-400">
            Guides, investment articles, and market insights
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group cursor-pointer flex flex-col">
            <div className="aspect-video w-full bg-zinc-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10 opacity-60"></div>
               <img
                 src={post.image}
                 alt={post.title}
                 className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
               />
               <div className="absolute top-3 left-3 z-20">
                 <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-600/90 text-white rounded">
                   {post.category}
                 </span>
               </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-[11px] text-zinc-500 font-mono mb-2">{post.date}</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{post.title}</h3>
              <p className="text-sm text-zinc-400 flex-1">{post.excerpt}</p>
              <div className="mt-4 text-xs font-semibold text-blue-500 group-hover:text-blue-400 transition-colors flex items-center">
                Read Article &rarr;
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
