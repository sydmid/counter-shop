import axios from "axios";
import { redis } from "./redis";
import { SteamInventoryResponse, SteamUserSummary } from "../types/steam";

const STEAM_API_KEY = process.env.STEAM_API_KEY || "";
const STEAM_API_BASE = "https://api.steampowered.com";
const STEAM_COMMUNITY_BASE = "https://steamcommunity.com";

export class SteamApiClient {
  /**
   * Fetches Steam player profile summary with 5-minute caching
   */
  static async getPlayerSummaries(steamIds: string[]): Promise<SteamUserSummary[]> {
    const cacheKey = `steam:summary:${steamIds.join(",")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamIds.join(",")}`;
      const res = await axios.get(url, { timeout: 5000 });
      const players = res.data?.response?.players || [];
      await redis.set(cacheKey, JSON.stringify(players), "EX", 300);
      return players;
    } catch (err) {
      console.error("Failed to fetch steam player summary:", err);
      return [];
    }
  }

  /**
   * Fetches full CS2 (730) or Dota 2 (570) inventory with Redis caching
   */
  static async getUserInventory(
    steamId: string,
    appId: number = 730,
    contextId: number = 2
  ): Promise<SteamInventoryResponse | null> {
    const cacheKey = `inventory:${steamId}:${appId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const url = `${STEAM_COMMUNITY_BASE}/inventory/${steamId}/${appId}/${contextId}?l=english&count=5000`;
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SteamItemExchange/1.0",
          "Referer": `https://steamcommunity.com/profiles/${steamId}/inventory/`,
        },
        timeout: 10000,
      });

      if (res.data && res.data.success) {
        await redis.set(cacheKey, JSON.stringify(res.data), "EX", 120); // 2 min cache
        return res.data;
      }
      return null;
    } catch (err: any) {
      console.warn(`Steam inventory rate-limited or private for ${steamId}:`, err.message);
      return null;
    }
  }

  /**
   * Fetches real-time price overview from Steam Community Market
   */
  static async getMarketPriceOverview(appId: number, marketHashName: string): Promise<{
    lowestPrice: number;
    medianPrice: number;
    volume: number;
  } | null> {
    const cacheKey = `steam:price:${appId}:${marketHashName}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const url = `${STEAM_COMMUNITY_BASE}/market/priceoverview/?appid=${appId}&currency=1&market_hash_name=${encodeURIComponent(
        marketHashName
      )}`;
      const res = await axios.get(url, { timeout: 4000 });
      if (res.data && res.data.success) {
        const lowest = parseFloat((res.data.lowest_price || "$0").replace(/[^0-9.]/g, "")) || 0;
        const median = parseFloat((res.data.median_price || "$0").replace(/[^0-9.]/g, "")) || lowest;
        const volume = parseInt((res.data.volume || "0").replace(/,/g, ""), 10) || 0;

        const result = { lowestPrice: lowest, medianPrice: median, volume };
        await redis.set(cacheKey, JSON.stringify(result), "EX", 60); // 1 min cache
        return result;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}
