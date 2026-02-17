// src/stores/userStore.ts
import { create } from "zustand";
import api from "../utils/api"; // 너 프로젝트 axios 인스턴스

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

interface UserStore {
  isLoading: boolean;
  error: string | null;

  register: (payload: RegisterPayload) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });

    try {
      // 백엔드 엔드포인트에 맞춰 수정
      // 예: POST /users/register or /users
      await api.post("/users/register", { name, email, password });
      // 서버가 user/token을 주면 여기서 저장하는 로직 추가 가능
    } catch (e: any) {
      set({
        error: e?.response?.data?.message ?? e?.message ?? "회원가입 실패",
      });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
