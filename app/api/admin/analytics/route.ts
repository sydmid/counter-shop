import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalUsers, totalItems, activeListings, totalTrades] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.marketListing.count({ where: { status: "ACTIVE" } }),
    prisma.tradeOffer.count(),
  ]);

  const items = await prisma.item.findMany({
    select: { currentPrice: true, volume24h: true },
  });

  const totalGMV = items.reduce((acc, i) => acc + i.currentPrice * i.volume24h, 0);

  const stats = {
    totalUsers,
    totalItems,
    activeListings,
    totalTrades,
    totalGMV: Math.round(totalGMV),
    platformFees24h: +(totalGMV * 0.02).toFixed(2),
    activeBots: 4,
    uptime: "99.98%",
    recentVolume: [
      { date: "Mon", volume: 42000, trades: 120 },
      { date: "Tue", volume: 56000, trades: 145 },
      { date: "Wed", volume: 78000, trades: 210 },
      { date: "Thu", volume: 64000, trades: 180 },
      { date: "Fri", volume: 89000, trades: 260 },
      { date: "Sat", volume: 112000, trades: 310 },
      { date: "Sun", volume: 98000, trades: 280 },
    ],
  };

  return NextResponse.json({ success: true, stats });
}
