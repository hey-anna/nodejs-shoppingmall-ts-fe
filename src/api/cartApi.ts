import api from "../utils/api";
import type { CartResponse } from "../types/cart";

export interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
}

export interface CartItem {
  _id: string;
  productId: Product; // populate된 형태
  size: string;
  qty: number;
}

export const fetchCartApi = async (): Promise<CartResponse> => {
  const res = await api.get("/cart");
  return res.data;
};

export const updateCartQtyApi = async (id: string, qty: number) => {
  const res = await api.put(`/cart/${id}`, { qty });
  return res.data;
};

export const deleteCartItemApi = async (id: string) => {
  const res = await api.delete(`/cart/${id}`);
  return res.data;
};

export const addToCartApi = async (productId: string, size: string, qty = 1) => {
  const res = await api.post("/cart", { productId, size, qty });
  return res.data;
};
