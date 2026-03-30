import { sdk } from "../config";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// ─── Types ──────────────────────────────────────────────
type SendOtpPayload = {
  phone: string;
  channel: "sms" | "whatsapp";
};

type VerifyOtpPayload = {
  phone: string;
  otp: string;
  pin: string;
  action?: "register" | "login";
};

type AuthResponse = {
  message: string;
  token?: string;
  error?: string;
};

// ─── Helpers ────────────────────────────────────────────
async function postToBackend<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }

  return data as T;
}

// ─── API Functions ──────────────────────────────────────

/**
 * Étape 1 : Envoyer un code OTP au numéro de téléphone.
 */
export async function sendOtp(payload: SendOtpPayload): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/send", payload);
}

/**
 * Étape 2 : Vérifier le code OTP + PIN → recevoir un JWT.
 */
export async function verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/verify", payload);
}

/**
 * Renvoyer le code OTP (même endpoint, même payload).
 */
export async function resendOtp(payload: SendOtpPayload): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/send", payload);
}
