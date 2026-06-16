import { createHash, randomInt } from "node:crypto";

const OTP_TTL_MS = 10 * 60 * 1000;

export function generateOtpCode(): string {
  return String(randomInt(100000, 999999));
}

export function hashOtp(code: string): string {
  const salt = process.env.AUTH_SECRET ?? "mynanganallur";
  return createHash("sha256").update(`${salt}:owner-otp:${code}`).digest("hex");
}

export function otpExpiresAt(): Date {
  return new Date(Date.now() + OTP_TTL_MS);
}

export function verifyOtpCode(code: string, codeHash: string): boolean {
  return hashOtp(code.trim()) === codeHash;
}
