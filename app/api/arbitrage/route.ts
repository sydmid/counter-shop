import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateArbitrageSpread } from "@/lib/arbitrage";

export async function GET() {
  const items = await prisma.item.findMany({
    where: { buff163Price: { not: null } },
    orderBy: { volume24h: "desc" },
    take: 30,
  });

  const deals = items
    .map((item) => {
      const metrics = calculateArbitrageSpread(item.currentPrice, item.buff163Price || 0, item.volume24h);
      return {
        id: item.id,
        marketHashName: item.marketHashName,
        appId: item.appId,
        iconUrl: item.iconUrl,
        steamPrice: item.currentPrice,
        buffPrice: item.buff163Price,
        ...metrics,
      };
    })
    .sort((a, b) => b.roiPercentage - a.roiPercentage);

  return NextResponse.json({ success: true, deals });
}
