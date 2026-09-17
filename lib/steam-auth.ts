import jwt from "jsonwebtoken";

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const JWT_SECRET = process.env.JWT_SECRET || "counter_shop_secret_jwt_2026";

export interface SteamAuthProfile {
  steamId: string;
  personaName: string;
  avatar: string;
  profileUrl: string;
}

/**
 * Generates the redirect URL for Steam OpenID login flow
 */
export function getSteamLoginUrl(returnUrl: string, realm: string): string {
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnUrl,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

/**
 * Validates the OpenID assertions sent back by Steam community login
 */
export async function verifySteamAssertion(params: Record<string, string>): Promise<string | null> {
  const validationParams = new URLSearchParams(params);
  validationParams.set("openid.mode", "check_authentication");

  const response = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: validationParams.toString(),
  });

  const bodyText = await response.text();
  if (bodyText.includes("is_valid:true")) {
    const claimedId = params["openid.claimed_id"];
    const match = claimedId?.match(/\/id\/(\d+)/);
    return match ? match[1] : null;
  }

  return null;
}

/**
 * Signs user session JWT for fast authentication without DB roundtrips on every request
 */
export function signUserJwt(payload: { id: string; steamId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyUserJwt(token: string): { id: string; steamId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}
