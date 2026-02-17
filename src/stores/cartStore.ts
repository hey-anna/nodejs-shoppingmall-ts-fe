import { create } from "zustand";
import { fetchCartApi, updateCartQtyApi, deleteCartItemApi, addToCartApi } from "../api/cartApi";
import type { CartItem } from "../api/cartApi";

type CartState = {
  cartList: CartItem[];
  totalPrice: number;
  // cartItemCount: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addToCart: (productId: string, size: string, qty?: number) => Promise<void>; // ✅ 추가
};

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, it) => sum + (it.productId?.price ?? 0) * it.qty, 0);

export const useCartStore = create<CartState>((set, get) => ({
  cartList: [],
  totalPrice: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchCartApi();
      set({
        cartList: data.cartList ?? [],
        totalPrice: data.totalPrice ?? calcTotal(data.cartList ?? []),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQty: async (id, qty) => {
    // 1) 낙관적 업데이트 (빠르게 반응)
    const prev = get().cartList;
    const next = prev.map((it) => (it._id === id ? { ...it, qty } : it));
    set({ cartList: next, totalPrice: calcTotal(next) });

    try {
      await updateCartQtyApi(id, qty);
    } catch (e) {
      // 실패 시 롤백
      set({ cartList: prev, totalPrice: calcTotal(prev) });
      throw e;
    }
  },

  deleteItem: async (id) => {
    const prev = get().cartList;
    const next = prev.filter((it) => it._id !== id);
    set({ cartList: next, totalPrice: calcTotal(next) });

    try {
      await deleteCartItemApi(id);
    } catch (e) {
      set({ cartList: prev, totalPrice: calcTotal(prev) });
      throw e;
    }
  },

  addToCart: async (productId: string, size: string, qty = 1) => {
    await addToCartApi(productId, size, qty);
    await get().fetchCart(); // 담은 후 장바구니 새로고침(가장 단순/안전)
  },
}));
