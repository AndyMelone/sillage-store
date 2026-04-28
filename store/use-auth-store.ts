import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  phone: string | null;
  isLoading: boolean;
  setAuthenticated: (phone: string, token?: string) => void;
  setUnauthenticated: () => void;
  checkAuth: () => void;
  logout: () => Promise<void>;
}

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )medusa_token=([^;]*)/);
  return match ? match[1] : null;
}

function getPhoneFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )medusa_phone=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  phone: null,
  isLoading: true,

  checkAuth: () => {
    const token = getTokenFromCookie();
    const phone = getPhoneFromCookie();
    set({
      isAuthenticated: !!token,
      phone: phone || null,
      isLoading: false,
    });
  },

  setAuthenticated: (phone: string, token?: string) => {
    document.cookie = `medusa_phone=${encodeURIComponent(phone)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    if (token) {
      document.cookie = `medusa_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    set({ isAuthenticated: true, phone });
  },

  setUnauthenticated: () => {
    set({ isAuthenticated: false, phone: null });
  },

  logout: async () => {
    document.cookie = "medusa_token=; path=/; max-age=0";
    document.cookie = "medusa_phone=; path=/; max-age=0";
    set({ isAuthenticated: false, phone: null });
  },
}));
