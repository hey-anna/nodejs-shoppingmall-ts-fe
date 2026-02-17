import { create } from "zustand";

export type ToastStatus = "success" | "error" | "warning" | "";

interface UIState {
  message: string;
  status: ToastStatus;
  show: (message: string, status: ToastStatus) => void;
  hide: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  message: "",
  status: "",

  show: (message, status) => set({ message, status }),
  hide: () => set({ message: "", status: "" }),
}));
