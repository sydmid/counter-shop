import { NextRequest, NextResponse } from "next/server";
import { TradeOfferManager } from "@/lib/trade-manager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tradeId, securityToken, action } = body;

    if (action === "ACCEPT") {
      const result = await TradeOfferManager.completeTrade(tradeId, securityToken);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
