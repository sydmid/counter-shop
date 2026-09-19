import crypto from "crypto";
import { prisma } from "./prisma";
import { generateProvablyFairRecord } from "./provably-fair";

export interface CreateTradeOfferInput {
  senderId: string;
  receiverId: string;
  message?: string;
  itemIdsToSend: string[];
  itemIdsToReceive: string[];
  clientSeed?: string;
}

export class TradeOfferManager {
  /**
   * Creates a provably fair trade offer in the platform database and prepares
   * the payload for Steam Trade Offer execution.
   */
  static async createPlatformTradeOffer(input: CreateTradeOfferInput) {
    const { senderId, receiverId, message, itemIdsToSend, itemIdsToReceive, clientSeed } = input;

    // 1. Calculate values and verify item ownership
    const senderItems = await prisma.inventoryItem.findMany({
      where: { id: { in: itemIdsToSend }, userId: senderId },
      include: { item: true },
    });

    const receiverItems = await prisma.inventoryItem.findMany({
      where: { id: { in: itemIdsToReceive }, userId: receiverId },
      include: { item: true },
    });

    if (senderItems.length !== itemIdsToSend.length) {
      throw new Error("One or more sender items do not exist in inventory or are locked");
    }

    if (receiverItems.length !== itemIdsToReceive.length) {
      throw new Error("One or more requested items do not exist in recipient inventory");
    }

    const totalSent = senderItems.reduce((acc, i) => acc + i.item.currentPrice, 0);
    const totalRecv = receiverItems.reduce((acc, i) => acc + i.item.currentPrice, 0);

    // 2. Generate provably fair verification token
    const proof = generateProvablyFairRecord(clientSeed || crypto.randomBytes(16).toString("hex"), 1);

    const securityToken = crypto.randomBytes(12).toString("hex");

    // 3. Create TradeOffer record transactionally
    const tradeOffer = await prisma.tradeOffer.create({
      data: {
        senderId,
        receiverId,
        message: message || "Direct Counter-Shop P2P Trade Offer",
        status: "PENDING",
        clientSeed: proof.clientSeed,
        serverSeed: proof.serverSeed,
        serverSeedHash: proof.serverSeedHash,
        nonce: 1,
        totalValueSent: totalSent,
        totalValueRecv: totalRecv,
        securityToken,
        items: {
          create: [
            ...senderItems.map((si) => ({
              itemId: si.itemId,
              assetId: si.assetId,
              direction: "GIVE",
              price: si.item.currentPrice,
            })),
            ...receiverItems.map((ri) => ({
              itemId: ri.itemId,
              assetId: ri.assetId,
              direction: "RECEIVE",
              price: ri.item.currentPrice,
            })),
          ],
        },
      },
      include: {
        items: { include: { item: true } },
        sender: true,
        receiver: true,
      },
    });

    return tradeOffer;
  }

  /**
   * Simulates/Executes trade completion and item ownership transfer
   */
  static async completeTrade(tradeId: string, securityToken: string) {
    const offer = await prisma.tradeOffer.findUnique({
      where: { id: tradeId },
      include: { items: true, sender: true, receiver: true },
    });

    if (!offer) throw new Error("Offer not found");
    if (offer.securityToken !== securityToken) throw new Error("Invalid security token");
    if (offer.status === "ACCEPTED" || offer.status === "COMPLETED") {
      throw new Error("Trade already finalized");
    }

    // Atomic database swap of item ownership
    await prisma.$transaction(async (tx) => {
      for (const item of offer.items) {
        const newOwnerId = item.direction === "GIVE" ? offer.receiverId : offer.senderId;
        await tx.inventoryItem.updateMany({
          where: { assetId: item.assetId },
          data: { userId: newOwnerId },
        });
      }

      await tx.tradeOffer.update({
        where: { id: tradeId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Issue notification to both parties
      await tx.notification.createMany({
        data: [
          {
            userId: offer.senderId,
            type: "TRADE_OFFER_ACCEPTED",
            title: "Trade Completed Successfully",
            message: `Trade offer #${offer.id.slice(0, 8)} has been accepted. Items are in your inventory.`,
          },
          {
            userId: offer.receiverId,
            type: "TRADE_OFFER_ACCEPTED",
            title: "Trade Completed Successfully",
            message: `Trade offer #${offer.id.slice(0, 8)} has been accepted. Items are in your inventory.`,
          },
        ],
      });
    });

    return { success: true, tradeId };
  }
}
