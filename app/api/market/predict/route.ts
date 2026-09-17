import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictItemPrice } from "@/lib/price-prediction";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ success: false, error: "Missing itemId" }, { status: 400 });
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      priceHistory: {
        orderBy: { timestamp: "asc" },
        take: 30,
      },
    },
  });

  if (!item) {
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  }

  const prediction = predictItemPrice(item.currentPrice, item.priceHistory);

  return NextResponse.json({
    success: true,
    item: {
      id: item.id,
      name: item.marketHashName,
      iconUrl: item.iconUrl,
    },
    prediction,
    history: item.priceHistory.map((h) => ({
      price: h.price,
      date: h.timestamp.toISOString().split("T")[0],
    })),
  });
}
