import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SteamApiClient } from "@/lib/steam-api";
import { rateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rl = await rateLimit(`inv:${ip}`, 30, 60);
  if (!rl.allowed) {
    return NextResponse.json({ success: false, error: "Too many inventory requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const appId = parseInt(searchParams.get("appId") || "730", 10);
  const steamId = searchParams.get("steamId");

  // Query local database inventory items
  const localItems = await prisma.inventoryItem.findMany({
    where: {
      item: { appId },
      ...(steamId ? { user: { steamId } } : {}),
    },
    include: {
      item: true,
      listing: true,
    },
    take: 50,
  });

  return NextResponse.json({
    success: true,
    appId,
    count: localItems.length,
    items: localItems.map((inv) => ({
      inventoryId: inv.id,
      assetId: inv.assetId,
      item: inv.item,
      floatValue: inv.floatValue,
      paintSeed: inv.paintSeed,
      stickers: inv.stickers,
      isTradable: inv.isTradable,
      listing: inv.listing,
    })),
  });
}
