import { sdk } from "@/lib/config";

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
  return sdk.client.fetch<T>(path, {
    method: "POST",
    body,
  });
}

// ─── Étape 1 : Vérifier si le téléphone existe ─────────
export async function checkPhone(phone: string): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/check-phone", { phone });
}

export async function sendLoginOtp(
  phone: string,
  channel: AuthMethod = "whatsapp",
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/send", {
    phone,
    channel,
  });
}

export async function verifyOtpForLogin(
  phone: string,
  code: string,
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/verify", {
    phone,
    code,
  });
}

export async function sendRegistrationOtp(
  phone: string,
  channel: AuthMethod = "whatsapp",
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/otp/send-new-account", {
    phone,
    channel,
  });
}

export async function registerWithOtp(
  phone: string,
  otp: string,
): Promise<AuthResponse> {
  return postToBackend<AuthResponse>("/store/auth/register-pin", {
    phone,
    otp,
  });
}
