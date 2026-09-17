import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tradeUrl, clientSeed } = body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(tradeUrl ? { tradeUrl } : {}),
        ...(clientSeed ? { clientSeed } : {}),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
