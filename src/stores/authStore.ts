import { create } from "zustand";
import { signinApi, signupApi, meApi } from "../api/authApi";
import type { AuthState, AuthUser } from "../types/auth";
import { STORAGE_KEY } from "../constants/storage";

// type Role = "customer" | "admin";

// interface AuthUser {
//   email: string;
//   role: Role;
// }

// interface AuthState {
//   isAuthed: boolean;
//   user: AuthUser | null;
//   token: string | null;

//   signin: (payload: { token: string; user: AuthUser }) => void;
//   signout: () => void;
// }

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isAuthed: boolean;
  isLoading: boolean;

  hydrate: () => void; // 새로고침 복원
  signin: (args: { email: string; password: string }) => Promise<void>;
  signup: (args: { name: string; email: string; password: string }) => Promise<void>;
  signout: () => void;

  loginWithToken: () => Promise<void>; // (선택) /users/me 있을 때만
};

const readFromStorage = (): AuthState | null => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as AuthState;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthed: false,
  isLoading: false,

  hydrate: () => {
    const saved = readFromStorage();
    if (!saved) return;

    set({
      user: saved.user,
      token: saved.token,
      isAuthed: Boolean(saved.token),
    });
  },

  signin: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const data = await signinApi({ email, password }); // AuthState: { token, user }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      set({ user: data.user, token: data.token, isAuthed: true });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async ({ name, email, password }) => {
    set({ isLoading: true });
    try {
      await signupApi({ name, email, password });
    } finally {
      set({ isLoading: false });
    }
  },

  signout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null, isAuthed: false });
  },

  loginWithToken: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const data = await meApi(); // { user }
      const next: AuthState = { token, user: data.user };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      set({ user: data.user, isAuthed: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// export const useAuthStore = create<AuthState>((set) => ({
//   isAuthed: false,
//   user: null,
//   token: null,

//   signin: ({ token, user }) => set({ isAuthed: true, token, user }),
//   signout: () => set({ isAuthed: false, token: null, user: null }),
// }));
