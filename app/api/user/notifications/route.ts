import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const notifications = await prisma.notification.findMany({
    where: userId ? { userId } : {},
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return NextResponse.json({ success: true, notifications });
}
