import { PrismaClient } from "@prisma/client";
import { encrypt } from "../lib/crypto";

const db = new PrismaClient();

async function main() {
  // 1. Create or get default provider
  let provider = await db.provider.findFirst({ where: { name: "Nexora Direct Server" } });
  if (!provider) {
    provider = await db.provider.create({
      data: {
        name: "Nexora Direct Server",
        apiUrl: "https://api.nexorasmm.com/v2",
        apiKeyEnc: encrypt("default_internal_provider_key_12345"),
        active: true,
        priority: 1,
        marginPct: 30,
        rateMultiplier: 1,
      },
    });
    console.log("Created Provider:", provider.name);
  }

  // 2. Popular Starter Services across all 6 platforms
  const sampleServices = [
    // Facebook
    {
      category: "Facebook",
      externalId: "fb_101",
      name: "Facebook Page Likes & Followers [Real Bangladeshi & Worldwide] - High Quality",
      rate: 90,
      sellRate: 120,
      min: 100,
      max: 50000,
    },
    {
      category: "Facebook",
      externalId: "fb_102",
      name: "Facebook Post Reactions [Love / Care / Wow / Like] - Instant Delivery",
      rate: 30,
      sellRate: 45,
      min: 50,
      max: 100000,
    },
    {
      category: "Facebook",
      externalId: "fb_103",
      name: "Facebook Profile Followers [HQ Profiles / 30 Days Refill]",
      rate: 80,
      sellRate: 110,
      min: 100,
      max: 50000,
    },
    // YouTube
    {
      category: "YouTube",
      externalId: "yt_201",
      name: "YouTube Monetization WatchTime [4000 Hours Package] - Non Drop / Safe",
      rate: 1400,
      sellRate: 1850,
      min: 500,
      max: 4000,
    },
    {
      category: "YouTube",
      externalId: "yt_202",
      name: "YouTube Real Video Views [High Retention / Lifetime Refill]",
      rate: 100,
      sellRate: 140,
      min: 500,
      max: 1000000,
    },
    {
      category: "YouTube",
      externalId: "yt_203",
      name: "YouTube Channel Subscribers [Real Active / 30 Days Guarantee]",
      rate: 350,
      sellRate: 450,
      min: 100,
      max: 50000,
    },
    // Instagram
    {
      category: "Instagram",
      externalId: "ig_301",
      name: "Instagram Followers [High Quality / Real Accounts / Instant]",
      rate: 65,
      sellRate: 89,
      min: 100,
      max: 100000,
    },
    {
      category: "Instagram",
      externalId: "ig_302",
      name: "Instagram Post Likes & Impressions [Super Fast / Non Drop]",
      rate: 18,
      sellRate: 25,
      min: 50,
      max: 500000,
    },
    {
      category: "Instagram",
      externalId: "ig_303",
      name: "Instagram Reels Viral Views [Instant Start / 100% Delivery]",
      rate: 8,
      sellRate: 12,
      min: 100,
      max: 10000000,
    },
    // TikTok
    {
      category: "TikTok",
      externalId: "tt_401",
      name: "TikTok Real Followers [Global / High Quality / No Password Required]",
      rate: 70,
      sellRate: 95,
      min: 100,
      max: 50000,
    },
    {
      category: "TikTok",
      externalId: "tt_402",
      name: "TikTok Video Viral Views [Instant Speed / Safe Algorithm]",
      rate: 5,
      sellRate: 8,
      min: 500,
      max: 5000000,
    },
    {
      category: "TikTok",
      externalId: "tt_403",
      name: "TikTok Video Likes & Shares [High Engagement]",
      rate: 35,
      sellRate: 49,
      min: 50,
      max: 50000,
    },
    // Telegram
    {
      category: "Telegram",
      externalId: "tg_501",
      name: "Telegram Channel / Group Members [0% Drop / 30 Days Guarantee]",
      rate: 45,
      sellRate: 65,
      min: 100,
      max: 50000,
    },
    {
      category: "Telegram",
      externalId: "tg_502",
      name: "Telegram Post Views [Latest 5 Posts / Instant Delivery]",
      rate: 10,
      sellRate: 15,
      min: 100,
      max: 100000,
    },
    // Twitter / X
    {
      category: "Twitter / X",
      externalId: "tw_601",
      name: "Twitter / X Followers [High Quality Global Profiles]",
      rate: 85,
      sellRate: 115,
      min: 100,
      max: 50000,
    },
    {
      category: "Twitter / X",
      externalId: "tw_602",
      name: "Twitter / X Retweets, Likes & Impressions [Viral Boost]",
      rate: 40,
      sellRate: 55,
      min: 50,
      max: 50000,
    },
  ];

  for (const s of sampleServices) {
    await db.service.upsert({
      where: {
        providerId_externalId: {
          providerId: provider.id,
          externalId: s.externalId,
        },
      },
      update: {
        name: s.name,
        category: s.category,
        rate: s.rate,
        sellRate: s.sellRate,
        min: s.min,
        max: s.max,
        active: true,
      },
      create: {
        providerId: provider.id,
        externalId: s.externalId,
        name: s.name,
        category: s.category,
        rate: s.rate,
        sellRate: s.sellRate,
        min: s.min,
        max: s.max,
        active: true,
      },
    });
  }

  const count = await db.service.count();
  console.log(`Success! Total active services in database: ${count}`);
}

main().finally(() => db.$disconnect());
