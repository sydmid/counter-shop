import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserJwt } from "@/lib/steam-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("counter_session")?.value;
  let decoded = token ? verifyUserJwt(token) : null;
  let user: any = null;

  if (decoded) {
    user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
  }

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listings = await prisma.marketListing.findMany({
      where: {
        userId: user.id,
        status: { in: ["SOLD", "ACTIVE"] },
      },
      include: {
        item: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const purchases = await prisma.tradeOffer.findMany({
      where: {
        receiverId: user.id,
        status: "ACCEPTED",
      },
      include: {
        items: {
          include: {
            item: true,
          }
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // In a real system, purchases would be linked to listings or a separate transaction model.
    // For now we map trade offers or just return a combined list of activity.
    // We can also fetch where a user bought a listing, but currently listing doesn"t have a buyerId.
    // So we will just show sell history from listings and a placeholder for purchase history if no explicit model exists.

    // Let"s check if we can add buyerId to MarketListing... No, it"s not in schema.
    // We will just return the user"s listings for sell history.

    // As for purchase history, we can assume if they have received items via trade offer.

    return NextResponse.json({
      success: true,
      sales: listings,
      purchases: purchases,
    });
  } catch (error: any) {
    console.error("Transactions fetch error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
