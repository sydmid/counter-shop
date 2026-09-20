import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inventoryItemId, price } = body;

    // Simulate Auth - Ensure demoUser is selling for demonstration
    const steamId = "76561198012345678";
    const user = await prisma.user.findUnique({
      where: { steamId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!inventoryItemId || price === undefined || isNaN(price) || price <= 0) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    // Determine the inventory item and check ownership
    const invItem = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { item: true, listing: true }
    });

    if (!invItem || invItem.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Inventory item not found or unauthorized" }, { status: 404 });
    }

    // Check if the item is tradable
    if (!invItem.isTradable) {
       return NextResponse.json({ success: false, error: "Item is not tradable" }, { status: 400 });
    }

    // Check if already listed (duplicate listing)
    if (invItem.listing && invItem.listing.status === "ACTIVE") {
      return NextResponse.json({ success: false, error: "Item is already listed" }, { status: 409 });
    }

    // Calculate dynamic fee exactly at > 1000
    // "Reduced to 6% for items > $1000" means exactly $1000 remains at 8%
    const feeRate = price > 1000 ? 0.06 : 0.08;

    // Use a transaction to ensure no duplicates are created concurrently
    const listing = await prisma.$transaction(async (tx) => {
       const existing = await tx.marketListing.findFirst({
          where: {
            inventoryItemId: invItem.id,
            status: "ACTIVE"
          }
       });

       if (existing) {
         throw new Error("ALREADY_LISTED");
       }

       return await tx.marketListing.create({
         data: {
           userId: invItem.userId,
           itemId: invItem.itemId,
           inventoryItemId: invItem.id,
           price: parseFloat(price.toFixed(2)),
           feeRate: feeRate,
           status: "ACTIVE",
           featured: price > 1000,
         }
       });
    });

    return NextResponse.json({
      success: true,
      listingId: listing.id,
    });
  } catch (error: any) {
    console.error("Sell API Error:", error);
    if (error.message === "ALREADY_LISTED") {
      return NextResponse.json({ success: false, error: "Item is already listed" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
