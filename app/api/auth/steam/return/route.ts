import { NextRequest, NextResponse } from "next/server";
import { verifySteamAssertion, signUserJwt } from "@/lib/steam-auth";
import { SteamApiClient } from "@/lib/steam-api";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    params[key] = val;
  });

  const steamId = await verifySteamAssertion(params);
  if (!steamId) {
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }

  // Fetch persona info from Steam Web API
  const playerSummaries = await SteamApiClient.getPlayerSummaries([steamId]);
  const player = playerSummaries[0];

  const personaName = player?.personaname || `Trader_${steamId.slice(-4)}`;
  const avatar = player?.avatarfull || "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";
  const profileUrl = player?.profileurl || `https://steamcommunity.com/profiles/${steamId}`;

  // Upsert user into database
  const user = await prisma.user.upsert({
    where: { steamId },
    update: {
      personaName,
      avatar,
      profileUrl,
    },
    create: {
      steamId,
      personaName,
      avatar,
      profileUrl,
      balance: 250.0, // Complimentary starter balance for demo
      clientSeed: crypto.randomBytes(16).toString("hex"),
    },
  });

  const token = signUserJwt({
    id: user.id,
    steamId: user.steamId,
    role: user.role,
  });

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set("counter_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
