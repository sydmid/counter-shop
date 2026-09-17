export interface SteamUserSummary {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  loccountrycode?: string;
}

export interface SteamAsset {
  appid: number;
  contextid: string;
  assetid: string;
  classid: string;
  instanceid: string;
  amount: string;
}

export interface SteamDescription {
  appid: number;
  classid: string;
  instanceid: string;
  currency: number;
  background_color: string;
  icon_url: string;
  icon_url_large?: string;
  descriptions: Array<{ type?: string; value: string; color?: string }>;
  tradable: number;
  actions?: Array<{ link: string; name: string }>;
  name: string;
  name_color?: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  market_actions?: Array<{ link: string; name: string }>;
  commodity: number;
  market_tradable_restriction?: number;
  marketable: number;
  tags?: Array<{
    category: string;
    internal_name: string;
    localized_category_name: string;
    localized_tag_name: string;
    color?: string;
  }>;
}

export interface SteamInventoryResponse {
  assets: SteamAsset[];
  descriptions: SteamDescription[];
  total_inventory_count: number;
  success: number;
  rwgrsn: number;
}

export interface TradeOfferRequest {
  partnerSteamId: string;
  partnerTradeUrl: string;
  itemsToSend: string[]; // assetIds
  itemsToReceive: string[]; // assetIds
  message?: string;
}
