import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictItemPrice } from "@/lib/price-prediction";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  const range = searchParams.get("range") || "1M";

  if (!itemId) {
    return NextResponse.json({ success: false, error: "Missing itemId" }, { status: 400 });
  }

  let days = 30;
  switch (range) {
    case "1W": days = 7; break;
    case "1M": days = 30; break;
    case "3M": days = 90; break;
    case "6M": days = 180; break;
    case "1Y": days = 365; break;
    default: days = 30; break;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      priceHistory: {
        where: {
          timestamp: {
            gte: startDate,
          }
        },
        orderBy: { timestamp: "asc" },
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
