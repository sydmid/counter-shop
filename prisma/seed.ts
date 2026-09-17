import { PrismaClient, ItemRarity, ItemCondition, Role } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Counter-Shop Database with CS2 and Dota 2 items...");

  // 1. Create Default Demo User
  const demoUser = await prisma.user.upsert({
    where: { steamId: "76561198012345678" },
    update: {},
    create: {
      steamId: "76561198012345678",
      personaName: "ProTrader_Elite",
      profileUrl: "https://steamcommunity.com/profiles/76561198012345678",
      avatar: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      avatarMedium: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
      avatarFull: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      role: Role.ADMIN,
      balance: 14850.50,
      tradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=52080000&token=DemoToken123",
      clientSeed: crypto.randomBytes(16).toString("hex"),
    },
  });

  // Secondary Demo User for P2P trading tests
  const traderUser = await prisma.user.upsert({
    where: { steamId: "76561198087654321" },
    update: {},
    create: {
      steamId: "76561198087654321",
      personaName: "SkinBaron_Vault",
      profileUrl: "https://steamcommunity.com/profiles/76561198087654321",
      avatar: "https://avatars.steamstatic.com/c4b8b60451a5472aa5e4f40f3b063ea534c892b1_full.jpg",
      role: Role.TRADER,
      balance: 5240.00,
      tradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=99881122&token=VaultToken789",
      clientSeed: crypto.randomBytes(16).toString("hex"),
    },
  });

  console.log(`Created demo users: ${demoUser.personaName} and ${traderUser.personaName}`);

  // 2. Catalog of Top Tier CS2 Items
  const cs2Items = [
    {
      appId: 730,
      marketHashName: "AWP | Dragon Lore (Factory New)",
      marketName: "AWP | Dragon Lore",
      type: "Sniper Rifle",
      category: "Weapon",
      subCategory: "AWP",
      rarity: ItemRarity.COVERT,
      condition: ItemCondition.FACTORY_NEW,
      minFloat: 0.00,
      maxFloat: 0.07,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0m_7zO6-fzj9V7Pp8j-3I4IG72ADk-ERkY277cYScewE5Y1zS-VO8yO26g5fu7pvOnCdj7ykqs3nfyhC1hktIcKUx0jC2zJ-7/360fx360f",
      currentPrice: 9450.00,
      buff163Price: 8200.00,
      volume24h: 3,
      priceChange24h: 2.45,
    },
    {
      appId: 730,
      marketHashName: "AK-47 | Case Hardened (Field-Tested) #661",
      marketName: "AK-47 | Case Hardened Scar Pattern",
      type: "Rifle",
      category: "Weapon",
      subCategory: "AK-47",
      rarity: ItemRarity.CLASSIFIED,
      condition: ItemCondition.FIELD_TESTED,
      minFloat: 0.15,
      maxFloat: 0.38,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nb-GkvP9Jrafw2lU6ccp07qX84n32w22-kdrZ27yLYTBdlA5N1uF_VO6k-rvhpPvvZTMz3Ng73Z2-z-DyP2h8Q1Q/360fx360f",
      currentPrice: 3800.00,
      buff163Price: 3150.00,
      volume24h: 12,
      priceChange24h: -1.20,
    },
    {
      appId: 730,
      marketHashName: "M9 Bayonet | Doppler (Factory New) Phase 4",
      marketName: "★ M9 Bayonet | Doppler",
      type: "Knife",
      category: "Knife",
      subCategory: "M9 Bayonet",
      rarity: ItemRarity.COVERT,
      condition: ItemCondition.FACTORY_NEW,
      minFloat: 0.01,
      maxFloat: 0.07,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbssLQJf1f_BYQJB-dmlq42Ok_7hNr7Zg2lfuPp9g-7J4cKi31e3qBFqamzwLNSddlA2YgnT_FG8x-3p1JXtvpjLznpgvnQrsSrelgv330_Z8D4TcA/360fx360f",
      currentPrice: 1250.00,
      buff163Price: 1090.00,
      volume24h: 45,
      priceChange24h: 4.80,
    },
    {
      appId: 730,
      marketHashName: "Sport Gloves | Vice (Field-Tested)",
      marketName: "★ Sport Gloves | Vice",
      type: "Gloves",
      category: "Gloves",
      subCategory: "Sport Gloves",
      rarity: ItemRarity.EXTRAORDINARY,
      condition: ItemCondition.FIELD_TESTED,
      minFloat: 0.15,
      maxFloat: 0.38,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DAQ1h3Lnd3oorLentzxOTDYjh9_9m4nZe0nvj4P7LQglRd4cJ5nqeW8N7x2QDk_0BpZ26ldY6VcFA7MVyE_QC9lOm7hcS07cvOynFiuiZxsC2IzQv3308Xg0Z1iQ/360fx360f",
      currentPrice: 2150.00,
      buff163Price: 1890.00,
      volume24h: 18,
      priceChange24h: 1.15,
    },
    {
      appId: 730,
      marketHashName: "M4A4 | Howl (Minimal Wear)",
      marketName: "M4A4 | Howl",
      type: "Rifle",
      category: "Weapon",
      subCategory: "M4A4",
      rarity: ItemRarity.CONTRABAND,
      condition: ItemCondition.MINIMAL_WEAR,
      minFloat: 0.07,
      maxFloat: 0.15,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITBhGJf_NZlmOzA-LP5gVO8v11rMTj7LYbDcgc2MlCC_lm-lenvhZK9uMzXiSw0m6r-Rns/360fx360f",
      currentPrice: 5600.00,
      buff163Price: 4850.00,
      volume24h: 5,
      priceChange24h: 0.50,
    },
    {
      appId: 730,
      marketHashName: "Desert Eagle | Printstream (Field-Tested)",
      marketName: "Desert Eagle | Printstream",
      type: "Pistol",
      category: "Weapon",
      subCategory: "Desert Eagle",
      rarity: ItemRarity.COVERT,
      condition: ItemCondition.FIELD_TESTED,
      minFloat: 0.15,
      maxFloat: 0.38,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_8j4hoW0k_K2MrbuhX9e7fp8j-3I4IG721Dk-0dvaz3yIYTBcgA9YAvUrFXtl7u61p7tvZ_OnnNl6yghsC2OnEC31xpIcKUx0k2w8uL7/360fx360f",
      currentPrice: 42.50,
      buff163Price: 34.00,
      volume24h: 210,
      priceChange24h: -3.20,
    }
  ];

  // 3. Catalog of High Demand Dota 2 Items
  const dota2Items = [
    {
      appId: 570,
      marketHashName: "Dragonclaw Hook",
      marketName: "Dragonclaw Hook",
      type: "Weapon",
      category: "Hero Item",
      subCategory: "Pudge",
      rarity: ItemRarity.IMMORTAL,
      condition: ItemCondition.NOT_APPLICABLE,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k0/360fx360f",
      currentPrice: 195.00,
      buff163Price: 165.00,
      volume24h: 35,
      priceChange24h: 1.80,
    },
    {
      appId: 570,
      marketHashName: "Manifold Paradox",
      marketName: "Exalted Manifold Paradox",
      type: "Weapon",
      category: "Hero Item",
      subCategory: "Phantom Assassin",
      rarity: ItemRarity.ARCANA,
      condition: ItemCondition.NOT_APPLICABLE,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k1/360fx360f",
      currentPrice: 38.50,
      buff163Price: 31.00,
      volume24h: 140,
      priceChange24h: -0.80,
    },
    {
      appId: 570,
      marketHashName: "Bladeform Legacy",
      marketName: "Exalted Bladeform Legacy",
      type: "Head",
      category: "Hero Item",
      subCategory: "Juggernaut",
      rarity: ItemRarity.ARCANA,
      condition: ItemCondition.NOT_APPLICABLE,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k2/360fx360f",
      currentPrice: 36.00,
      buff163Price: 29.50,
      volume24h: 180,
      priceChange24h: 0.90,
    },
    {
      appId: 570,
      marketHashName: "Dark Artistry Cape",
      marketName: "Dark Artistry Cape",
      type: "Back",
      category: "Hero Item",
      subCategory: "Invoker",
      rarity: ItemRarity.IMMORTAL,
      condition: ItemCondition.NOT_APPLICABLE,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k3/360fx360f",
      currentPrice: 145.00,
      buff163Price: 122.00,
      volume24h: 22,
      priceChange24h: 3.40,
    },
    {
      appId: 570,
      marketHashName: "Golden Severing Crest",
      marketName: "Golden Severing Crest",
      type: "Weapon",
      category: "Hero Item",
      subCategory: "Razor",
      rarity: ItemRarity.IMMORTAL,
      condition: ItemCondition.NOT_APPLICABLE,
      iconUrl: "https://community.cloudflare.steamstatic.com/economy/image/W_I_5GLm4NpPndTRSgOMmsKEndrObpz0jyz5AlNx2qfzxIoAZ3EhCQvRDA28PtVEupv41snks6068q2kn4vbfomjeDeA-EY_n4iT-vYg7k6fC9uC4tYxGf-e4f4_9p5Q1Y6A3p9s7y1k6vK7yG3y_m3k4/360fx360f",
      currentPrice: 85.00,
      buff163Price: 71.00,
      volume24h: 15,
      priceChange24h: -2.10,
    }
  ];

  const allItems = [...cs2Items, ...dota2Items];

  for (const itemData of allItems) {
    const item = await prisma.item.upsert({
      where: { marketHashName: itemData.marketHashName },
      update: itemData,
      create: itemData,
    });

    // Generate 30 days of synthetic price history for charts & AI model
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = (Math.random() - 0.48) * (item.currentPrice * 0.08);
      const histPrice = Math.max(1, +(item.currentPrice + variance).toFixed(2));
      
      await prisma.priceHistory.create({
        data: {
          itemId: item.id,
          price: histPrice,
          volume: Math.floor(Math.random() * 50) + 5,
          source: "STEAM",
          timestamp: date,
        },
      });
    }

    // Generate Arbitrage Deal entries
    if (item.buff163Price) {
      const spread = +(item.currentPrice - item.buff163Price).toFixed(2);
      // Steam cut is 15% (item.currentPrice * 0.85 - buff163Price)
      const netProfit = +(item.currentPrice * 0.85 - item.buff163Price).toFixed(2);
      const roi = +((netProfit / item.buff163Price) * 100).toFixed(2);

      await prisma.arbitrageDeal.create({
        data: {
          itemId: item.id,
          steamPrice: item.currentPrice,
          buffPrice: item.buff163Price,
          priceSpread: spread,
          roiPercentage: roi,
          volumeDaily: item.volume24h,
          isExecutable: roi > 0,
        },
      });
    }

    // Give Demo User an inventory copy and create a marketplace listing
    const inv = await prisma.inventoryItem.create({
      data: {
        assetId: `asset_${item.id}_${Math.floor(Math.random() * 1000000)}`,
        userId: demoUser.id,
        itemId: item.id,
        floatValue: item.minFloat ? +(item.minFloat + Math.random() * 0.02).toFixed(4) : null,
        paintSeed: Math.floor(Math.random() * 1000),
        isTradable: true,
        stickers: item.appId === 730 ? [
          { name: "Titan (Holo) | Katowice 2014", slot: 0, wear: 0.0 },
          { name: "Crown (Foil)", slot: 1, wear: 0.02 }
        ] : null,
      },
    });

    // Create an active listing in market
    await prisma.marketListing.create({
      data: {
        userId: demoUser.id,
        itemId: item.id,
        inventoryItemId: inv.id,
        price: item.currentPrice,
        status: "ACTIVE",
        featured: item.currentPrice > 1000,
      }
    });
  }

  // Create a Sample Trade Offer between demoUser and traderUser
  const sampleOffer = await prisma.tradeOffer.create({
    data: {
      senderId: traderUser.id,
      receiverId: demoUser.id,
      steamOfferId: "OFFER_99882211",
      message: "Hey! Want to trade my Dragonclaw Hook for your Vice Gloves + cash offset.",
      status: "PENDING",
      clientSeed: "seed_client_xyz123",
      serverSeed: "seed_server_hash_abc456",
      serverSeedHash: crypto.createHash("sha256").update("seed_server_hash_abc456").digest("hex"),
      nonce: 1,
      totalValueSent: 195.00,
      totalValueRecv: 2150.00,
      securityToken: crypto.randomBytes(8).toString("hex"),
    }
  });

  // Create Welcome Notification
  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      type: "SYSTEM_ALERT",
      title: "Welcome to Counter-Shop Platform",
      message: "Your Steam inventory is connected. Real-time market ticker and arbitrage signals are active.",
    }
  });

  console.log("✅ Counter-Shop database successfully seeded with CS2, Dota 2, Listings, and Seed history!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
