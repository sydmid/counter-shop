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

    const { listingIds, paymentMethod, promoCode } = await req.json();

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json({ success: false, error: "No items provided" }, { status: 400 });
    }

    if (!["CARD", "SEPA", "ACH", "PAYPAL"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 });
    }

    // Process checkout
    let discount = 0;
    if (promoCode && promoCode.toUpperCase() === "NEWUSER20") {
      discount = 0.20; // 20% OFF
    }

    // Fetch listings to calculate totals
    const listings = await prisma.marketListing.findMany({
      where: {
        id: { in: listingIds },
        status: "ACTIVE",
      },
    });

    if (listings.length === 0) {
      return NextResponse.json({ success: false, error: "Items not available or already sold" }, { status: 400 });
    }

    const subtotal = listings.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = subtotal * discount;
    const totalPaid = subtotal - discountAmount;

    // Mark listings as SOLD if they exist and are ACTIVE
    const updatedListings = await prisma.marketListing.updateMany({
      where: {
        id: { in: listings.map(l => l.id) },
        status: "ACTIVE",
      },
      data: {
        status: "SOLD",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Checkout successful. Custodial auto-delivery initiated.",
      count: updatedListings.count,
      subtotal,
      discount: discountAmount,
      totalPaid,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
