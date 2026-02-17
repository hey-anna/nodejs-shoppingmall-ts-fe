import api from "../utils/api";
import type { Product, ProductForm } from "../types/product";

export type ProductListQuery = { page?: number; name?: string };

// 서버 응답이 아래 둘 중 하나일 수 있음:
// 1) { productList, totalPageNum }
// 2) Product[]
type RawProductListResponse = { productList: Product[]; totalPageNum: number } | Product[];

export type NormalizedProductListResponse = {
  productList: Product[];
  totalPageNum: number;
};

// ✅ 목록 조회 (원본 그대로 반환)
export const getProductListRawApi = async (
  query: ProductListQuery = {},
): Promise<RawProductListResponse> => {
  const res = await api.get("/products", { params: query });
  return res.data;
};

// ✅ 목록 조회 (항상 같은 형태로 정규화해서 반환)  ← store에서 이거 쓰면 제일 깔끔
export const getProductListApi = async (
  query: ProductListQuery = {},
): Promise<NormalizedProductListResponse> => {
  const data = await getProductListRawApi(query);

  if (Array.isArray(data)) {
    return { productList: data, totalPageNum: 1 };
  }

  return {
    productList: data.productList ?? [],
    totalPageNum: data.totalPageNum ?? 1,
  };
};

// ✅ 상세 조회
export const getProductDetailApi = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// ✅ 삭제
export const deleteProductApi = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// 서버가 { product: Product } 또는 Product 를 줄 수 있어서 흡수
type RawProductResponse = { product: Product } | Product;

const unwrapProduct = (data: RawProductResponse): Product =>
  (data as { product: Product }).product ?? (data as Product);

// ✅ 생성
export const createProductApi = async (payload: ProductForm): Promise<Product> => {
  const res = await api.post("/products", payload);
  return unwrapProduct(res.data);
};

// ✅ 수정
export const editProductApi = async (id: string, payload: ProductForm): Promise<Product> => {
  const res = await api.put(`/products/${id}`, payload);
  return unwrapProduct(res.data);
};

// import { create } from "zustand";
// import { getProductListApi, getProductDetailApi, type ProductDetail } from "../api/productApi";

// export interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string; // 목록에서 필요하면
// }

// export type ProductListQuery = { page?: number; name?: string };

// export type ProductListResponse = { productList: Product[]; totalPageNum: number } | Product[];

// export type ProductListResponse = { productList: Product[]; totalPageNum: number } | Product[];

// export interface ProductDetail {
//   _id: string;
//   image: string;
//   name: string;
//   price: number;
//   description?: string;
//   stock: Record<string, number>; // { s: 3, m: 0 ... }
// }

// 상품 목록 조회
// export const getProductListApi = async (name?: string) => {
//   const res = await api.get("/products", {
//     params: { name },
//   });
//   return res.data;
// };
// export const getProductListApi = async (query: ProductListQuery = {}): Promise<ProductListResponse> => {
//   const res = await api.get("/products", { params: query });
//   return res.data;
// };

// // 상품 상세 조회
// export const getProductDetailApi = async (id: string): Promise<ProductDetail> => {
//   const res = await api.get(`/products/${id}`);
//   return res.data;
// };
//

// export const getProductDetailApi = async (id: string): Promise<Product> => {
//   const res = await api.get(`/products/${id}`);
//   return res.data;
// };

// export const deleteProductApi = async (id: string): Promise<void> => {
//   await api.delete(`/products/${id}`);
// };

// export const createProductApi = async (
//   payload: ProductForm,
// ): Promise<{ product?: Product } | Product> => {
//   const res = await api.post("/products", payload);
//   return res.data;
// };

// export const editProductApi = async (
//   id: string,
//   payload: ProductForm,
// ): Promise<{ product?: Product } | Product> => {
//   const res = await api.put(`/products/${id}`, payload);
//   return res.data;
// };

// // import { create } from "zustand";
// // import { getProductListApi, getProductDetailApi, type ProductDetail } from "../api/productApi";

// // type Product = Pick<ProductDetail, "_id" | "name" | "price">;

// // interface ProductStore {
// //   productList: Product[];
// //   selectedProduct: ProductDetail | null;
// //   isLoading: boolean;
// //   error: string | null;

// //   fetchProducts: (name?: string) => Promise<void>;
// //   fetchProductDetail: (id: string) => Promise<void>;
// // }

// // export const useProductStore = create<ProductStore>((set) => ({
// //   productList: [],
// //   selectedProduct: null,
// //   isLoading: false,
// //   error: null,

// //   fetchProducts: async (name) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const data = await getProductListApi(name);
// //       set({ productList: data });
// //     } catch (e) {
// //       set({ error: e instanceof Error ? e.message : "상품 목록을 불러오지 못했어요." });
// //     } finally {
// //       set({ isLoading: false });
// //     }
// //   },

// //   fetchProductDetail: async (id) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const data = await getProductDetailApi(id);
// //       set({ selectedProduct: data });
// //     } catch (e) {
// //       set({ error: e instanceof Error ? e.message : "상품 정보를 불러오지 못했어요." });
// //     } finally {
// //       set({ isLoading: false });
// //     }
// //   },
// // }));
