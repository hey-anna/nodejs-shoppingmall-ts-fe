import api from "../../utils/api";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  size: string;
  qty: number;
}

export interface Order {
  _id: string;
  orderNum: string; // 백엔에서 주는 주문번호 필드명에 맞추기
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

export interface OrderListResponse {
  orderList: Order[];
  totalPageNum?: number;
}

export const createOrderApi = async (payload: unknown) => {
  // payload: 결제/배송정보 등 네 백엔 스펙에 맞게 타입 지정 가능
  const res = await api.post("/order", payload);
  return res.data; // { orderNum, ... } 형태일 가능성
};

export const getOrderApi = async () => {
  const res = await api.get("/order/me"); // 예시
  return res.data;
};

export const getOrderListApi = async (query?: Record<string, string | number>) => {
  const res = await api.get("/order", { params: query });
  return res.data as OrderListResponse;
};

export const updateOrderApi = async (id: string, status: OrderStatus) => {
  const res = await api.put(`/order/${id}`, { status });
  return res.data;
};
