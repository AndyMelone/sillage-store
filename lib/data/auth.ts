const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// ─── Types ──────────────────────────────────────────────
export type AuthMethod = "sms" | "whatsapp";

export type AuthResponse = {
  message: string;
  token?: string;
  exists?: boolean;
  error?: string;
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

/**
 * Étape 1 : Vérifier si le téléphone existe
 */
export async function checkPhone(phone: string): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/check-phone", { phone });
}

/**
 * Étape 2 (Existant) : Connexion par PIN
 */
export async function loginWithPin(phone: string, pin: string): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/login-pin", { phone, pin });
}

/**
 * Étape 2 (Nouveau / Reset) : Envoyer OTP
 */
export async function sendOtp(phone: string, channel: AuthMethod, type: "new" | "reset"): Promise<AuthResponse> {
  const path = type === "new" ? "/store/auth/otp/send-new-account" : "/store/auth/otp/send-reset-pin";
  return postToBackend<AuthResponse>(path, { phone, channel });
}

/**
 * Étape 3 (Nouveau) : Créer compte avec OTP + PIN
 */
export async function registerWithOtp(phone: string, otp: string, pin: string): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/register-pin", { phone, otp, pin });
}

/**
 * Étape 3 (Reset) : Réinitialiser PIN avec OTP
 */
export async function resetPin(phone: string, otp: string, new_pin: string): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/pin/reset", { phone, otp, new_pin });
}
