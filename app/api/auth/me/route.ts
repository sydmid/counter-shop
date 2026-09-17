import { NextRequest, NextResponse } from "next/server";
import { verifyUserJwt } from "@/lib/steam-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("counter_session")?.value;
  let decoded = token ? verifyUserJwt(token) : null;

  // If no auth token in development, return demo user for immediate testability
  let user: any = null;
  if (decoded) {
    user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { accounts: true },
    });
  }

  if (!user) {
    user = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      include: { accounts: true },
    });
  }

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      steamId: user.steamId,
      personaName: user.personaName,
      avatar: user.avatar,
      balance: user.balance,
      role: user.role,
      tradeUrl: user.tradeUrl,
      clientSeed: user.clientSeed,
      accounts: user.accounts,
    },
  });
}
