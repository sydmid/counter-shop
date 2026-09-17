import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET() {
  const cacheKey = "market:ticker:live";
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json({ success: true, ticker: JSON.parse(cached) });
  }

  const items = await prisma.item.findMany({
    orderBy: { volume24h: "desc" },
    take: 12,
    select: {
      id: true,
      marketHashName: true,
      currentPrice: true,
      priceChange24h: true,
      appId: true,
      iconUrl: true,
    },
  });

  const ticker = items.map((i) => ({
    id: i.id,
    name: i.marketHashName,
    price: i.currentPrice,
    change: i.priceChange24h,
    appId: i.appId,
    icon: i.iconUrl,
  }));

  await redis.set(cacheKey, JSON.stringify(ticker), "EX", 10); // 10 second ticker refresh

  return NextResponse.json({ success: true, ticker });
}
