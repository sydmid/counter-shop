import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const offers = await prisma.tradeOffer.findMany({
    where: userId
      ? {
          OR: [{ senderId: userId }, { receiverId: userId }],
        }
      : {},
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, personaName: true, avatar: true } },
      receiver: { select: { id: true, personaName: true, avatar: true } },
      items: { include: { item: true } },
    },
    take: 20,
  });

  return NextResponse.json({ success: true, offers });
}
