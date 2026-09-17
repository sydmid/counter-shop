import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appId = parseInt(searchParams.get("appId") || "730", 10);
  const query = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const rarity = searchParams.get("rarity");
  const condition = searchParams.get("condition");
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "100000");
  const sort = searchParams.get("sort") || "price_asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "24", 10));

  const whereClause: any = {
    appId,
    currentPrice: { gte: minPrice, lte: maxPrice },
  };

  if (query) {
    whereClause.OR = [
      { marketName: { contains: query, mode: "insensitive" } },
      { marketHashName: { contains: query, mode: "insensitive" } },
      { subCategory: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category && category !== "ALL") {
    whereClause.category = category;
  }

  if (rarity && rarity !== "ALL") {
    whereClause.rarity = rarity;
  }

  if (condition && condition !== "ALL") {
    whereClause.condition = condition;
  }

  let orderBy: any = { currentPrice: "asc" };
  if (sort === "price_desc") orderBy = { currentPrice: "desc" };
  if (sort === "volume") orderBy = { volume24h: "desc" };
  if (sort === "gainers") orderBy = { priceChange24h: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        listings: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    }),
    prisma.item.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items: items.map((it) => ({
      ...it,
      listingId: it.listings[0]?.id,
    })),
  });
}
