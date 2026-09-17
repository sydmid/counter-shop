import { ArbitrageOpportunity, MarketItemView } from "../types/market";

const STEAM_COMMUNITY_FEE_RATE = 0.15; // 15% Steam Community Market combined fee
const PLATFORM_FEE_RATE = 0.02; // 2% Counter-Shop exchange fee

/**
 * Calculates profit margins and real-time arbitrage triggers
 * between BUFF163/External cash markets and Steam Community Market.
 */
export function calculateArbitrageSpread(
  steamPrice: number,
  buffPrice: number,
  volume24h: number = 10
): {
  spread: number;
  steamNetPayout: number;
  netProfit: number;
  roiPercentage: number;
  isExecutable: boolean;
} {
  const spread = +(steamPrice - buffPrice).toFixed(2);
  const steamNetPayout = +(steamPrice * (1 - STEAM_COMMUNITY_FEE_RATE)).toFixed(2);
  const netProfit = +(steamNetPayout - buffPrice).toFixed(2);
  const roiPercentage = buffPrice > 0 ? +((netProfit / buffPrice) * 100).toFixed(2) : 0;
  
  // Safe arbitrage execution criteria: positive ROI and sufficient liquidity
  const isExecutable = roiPercentage > 5.0 && volume24h >= 5;

  return {
    spread,
    steamNetPayout,
    netProfit,
    roiPercentage,
    isExecutable,
  };
}

export function formatArbitrageOpportunity(
  item: MarketItemView,
  buffPrice: number
): ArbitrageOpportunity {
  const metrics = calculateArbitrageSpread(item.currentPrice, buffPrice, item.volume24h);
  return {
    id: `arb_${item.id}`,
    item,
    steamPrice: item.currentPrice,
    buffPrice,
    spread: metrics.spread,
    netProfit: metrics.netProfit,
    roiPercentage: metrics.roiPercentage,
    volume: item.volume24h,
    isExecutable: metrics.isExecutable,
  };
}
