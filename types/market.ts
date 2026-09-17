export type GameAppId = 730 | 570; // 730: CS2, 570: Dota 2

export interface MarketItemView {
  id: string;
  appId: number;
  marketHashName: string;
  marketName: string;
  type: string;
  category: string;
  subCategory?: string | null;
  rarity: string;
  condition: string;
  minFloat?: number | null;
  maxFloat?: number | null;
  iconUrl: string;
  currentPrice: number;
  buff163Price?: number | null;
  skinportPrice?: number | null;
  volume24h: number;
  priceChange24h: number;
  isStatTrak: boolean;
  isSouvenir: boolean;
  tradable: boolean;
  listingId?: string;
  floatValue?: number | null;
  paintSeed?: number | null;
  stickers?: any;
}

export interface ArbitrageOpportunity {
  id: string;
  item: MarketItemView;
  steamPrice: number;
  buffPrice: number;
  spread: number;
  netProfit: number;
  roiPercentage: number;
  volume: number;
  isExecutable: boolean;
}

export interface PriceTickerItem {
  id: string;
  marketHashName: string;
  price: number;
  change: number;
  appId: number;
  iconUrl: string;
}

export interface ProvablyFairRecord {
  clientSeed: string;
  serverSeed: string;
  serverSeedHash: string;
  nonce: number;
  outcomeHash: string;
  isValid: boolean;
}
