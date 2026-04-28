const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "https://sillage-back-production.up.railway.app/";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// ─── Types ──────────────────────────────────────────────
export type AuthMethod = "sms" | "whatsapp";

export type AuthResponse = {
  message?: string;
  token?: string;
  exists?: boolean;
  error?: string;
  customer?: { id: string; phone?: string };
};

async function postToBackend<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
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

// ─── Étape 1 : Vérifier si le téléphone existe ─────────
export async function checkPhone(phone: string): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/check-phone", { phone });
}

// ─── Flow existant — étape 2 : Vérifier le PIN + envoyer OTP (2FA) ─────
export async function sendOtpWithPin(
  phone: string,
  pin: string,
  channel: AuthMethod = "whatsapp",
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/send", {
    phone,
    pin,
    channel,
  });
}

// ─── Flow existant — étape 3 : Vérifier l'OTP → JWT ───
export async function verifyOtpForLogin(
  phone: string,
  code: string,
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/verify", {
    phone,
    code,
  });
}

// ─── Flow nouveau compte — étape 2 : Envoyer OTP sans PIN ─────────────
export async function sendOtp(
  phone: string,
  channel: AuthMethod,
  type: "new" | "reset",
): Promise<AuthResponse> {
  const path =
    type === "new"
      ? "/store/auth/otp/send-new-account"
      : "/store/auth/otp/send-reset-pin";
  return postToBackend<AuthResponse>(path, { phone, channel });
}

// ─── Flow nouveau compte — étape 3 : Créer compte OTP + PIN → JWT ─────
export async function registerWithOtp(
  phone: string,
  otp: string,
  pin: string,
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/register-pin", {
    phone,
    otp,
    pin,
  });
}

// ─── Flow reset PIN — étape 2 : OTP + nouveau PIN → JWT ───────────────
export async function resetPin(
  phone: string,
  otp: string,
  new_pin: string,
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/pin/reset", {
    phone,
    otp,
    new_pin,
  });
}
