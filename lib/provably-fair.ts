import crypto from "crypto";
import { ProvablyFairRecord } from "../types/market";

/**
 * Generates an auditable cryptographic seed pair.
 * The serverSeedHash is committed to the client before the trade execution.
 * Once executed, the unhashed serverSeed is revealed so the user can verify.
 */
export function generateProvablyFairRecord(clientSeed: string, nonce: number = 1): ProvablyFairRecord {
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const serverSeedHash = crypto.createHash("sha256").update(serverSeed).digest("hex");
  
  const outcomeHash = crypto
    .createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");

  return {
    clientSeed,
    serverSeed,
    serverSeedHash,
    nonce,
    outcomeHash,
    isValid: true,
  };
}

/**
 * Verifies that a revealed serverSeed produces the exact serverSeedHash
 * and calculates the deterministic trade token verification.
 */
export function verifyProvablyFair(
  clientSeed: string,
  serverSeed: string,
  serverSeedHash: string,
  nonce: number
): { verified: boolean; calculatedOutcomeHash: string } {
  const expectedHash = crypto.createHash("sha256").update(serverSeed).digest("hex");
  if (expectedHash !== serverSeedHash) {
    return { verified: false, calculatedOutcomeHash: "" };
  }

  const calculatedOutcomeHash = crypto
    .createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");

  return { verified: true, calculatedOutcomeHash };
}
