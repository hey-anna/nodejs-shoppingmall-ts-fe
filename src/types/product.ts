// src/types/product.ts
export type ProductStatus = "active" | "inactive";

// 사이즈가 정해져 있다면 string 대신 union 추천
// export type StockSize = "xs" | "s" | "m" | "l" | "xl" | "xxl";
// 만약 진짜 자유롭게 올 수 있으면: export type StockSize = string;

export type StockSize = string; // 우선 string으로 (S/M/L 등). 더 엄격히 하려면 union으로.
// export type StockMap = Record<StockSize, number>;
export type StockMap = Partial<Record<StockSize, number>>;

export interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: StockMap;
  image: string;
  description: string;
  category: string[];
  status: ProductStatus;
  price: number;
}

export type ProductForm = Omit<Product, "_id"> & { _id?: string };
