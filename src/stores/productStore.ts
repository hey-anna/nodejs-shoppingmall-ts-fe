import { create } from "zustand";
import type { Product, ProductForm } from "../types/product";
import {
  getProductListApi,
  deleteProductApi,
  createProductApi,
  editProductApi,
  type ProductListQuery,
} from "../api/productApi";

export interface ProductStore {
  productList: Product[];
  totalPageNum: number;
  selectedProduct: Product | null;

  isLoading: boolean;
  error: string | null;
  success: boolean;

  fetchProducts: (query?: ProductListQuery) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createProduct: (payload: ProductForm) => Promise<void>;
  editProduct: (id: string, payload: ProductForm) => Promise<void>;

  setSelectedProduct: (p: Product | null) => void;
  clearSuccess: () => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  productList: [],
  totalPageNum: 1,
  selectedProduct: null,

  isLoading: false,
  error: null,
  success: false,

  setSelectedProduct: (p) => set({ selectedProduct: p }),
  clearSuccess: () => set({ success: false }),
  clearError: () => set({ error: null }),

  fetchProducts: async (query = {}) => {
    set({ isLoading: true, error: null });

    try {
      const { productList, totalPageNum } = await getProductListApi(query);
      set({ productList, totalPageNum });
    } catch (e: any) {
      set({ error: e?.message ?? "상품 목록 조회 실패" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null, success: false });

    try {
      await deleteProductApi(id);
      set((state) => ({
        productList: state.productList.filter((p) => p._id !== id),
        success: true,
      }));
    } catch (e: any) {
      set({ error: e?.message ?? "상품 삭제 실패" });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (payload) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const created = await createProductApi(payload);
      set((state) => ({
        productList: [created, ...state.productList],
        success: true,
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "상품 생성 실패" });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  editProduct: async (id, payload) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const updated = await editProductApi(id, payload);

      set((state) => ({
        productList: state.productList.map((p) => (p._id === id ? updated : p)),
        selectedProduct: state.selectedProduct?._id === id ? updated : state.selectedProduct,
        success: true,
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "상품 수정 실패" });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
