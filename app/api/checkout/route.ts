import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserJwt } from "@/lib/steam-auth";

export async function POST(req: NextRequest) {
  try {
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

    const { listingIds, paymentMethod } = await req.json();

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json({ success: false, error: "No items provided" }, { status: 400 });
    }

    if (!["CARD", "SEPA", "ACH", "PAYPAL"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 });
    }

    // Process checkout
    // Mark listings as SOLD if they exist and are ACTIVE
    const updatedListings = await prisma.marketListing.updateMany({
      where: {
        id: { in: listingIds },
        status: "ACTIVE",
      },
      data: {
        status: "SOLD",
      },
    });

    if (updatedListings.count === 0) {
      return NextResponse.json({ success: false, error: "Items not available or already sold" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Checkout successful. Custodial auto-delivery initiated.",
      count: updatedListings.count,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
