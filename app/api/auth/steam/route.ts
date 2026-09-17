import { NextRequest, NextResponse } from "next/server";
import { getSteamLoginUrl } from "@/lib/steam-auth";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const realm = `${protocol}://${host}`;
  const returnUrl = `${realm}/api/auth/steam/return`;

  const redirectUrl = getSteamLoginUrl(returnUrl, realm);
  return NextResponse.redirect(redirectUrl);
}
