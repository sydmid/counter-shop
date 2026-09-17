import { NextRequest, NextResponse } from "next/server";
import { TradeOfferManager } from "@/lib/trade-manager";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderId, receiverId, message, itemIdsToSend, itemIdsToReceive, clientSeed } = body;

    if (!senderId || !receiverId) {
      return NextResponse.json({ success: false, error: "Missing sender or receiver" }, { status: 400 });
    }

    const tradeOffer = await TradeOfferManager.createPlatformTradeOffer({
      senderId,
      receiverId,
      message,
      itemIdsToSend: itemIdsToSend || [],
      itemIdsToReceive: itemIdsToReceive || [],
      clientSeed,
    });

    return NextResponse.json({
      success: true,
      tradeOffer,
      message: "Trade offer created with provably fair cryptographic proof.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
