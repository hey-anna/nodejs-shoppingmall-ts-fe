// import { create } from "zustand";

// interface OrderState {
//   orderNum: string;
//   setOrderNum: (orderNum: string) => void;
//   clearOrderNum: () => void;
// }

// export const useOrderStore = create<OrderState>((set) => ({
//   orderNum: "",
//   setOrderNum: (orderNum) => set({ orderNum }),
//   clearOrderNum: () => set({ orderNum: "" }),
// }));

// src/stores/orderStore.ts
import { create } from "zustand";
import api from "../utils/api";
import type { OrderItem } from "../types/order";
import type { OrderStatus } from "../constants/order.constants";

// export interface OrderItem {
//   _id: string;
// }
type AdminOrderQuery = {
  page: number;
  ordernum?: string;
};

type ShipInfo = {
  firstName: string;
  lastName: string;
  contact: string;
  address: string;
  city: string;
  zip: string;
};

type CardValue = {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
};

interface OrderStore {
  // 주문번호 (결제 완료 후)
  orderNum: string;
  setOrderNum: (orderNum: string) => void;
  clearOrderNum: () => void;

  // 주문 목록
  orderList: OrderItem[];
  // isLoading: boolean;
  // error: string | null;

  fetchOrders: () => Promise<void>;
  clearOrders: () => void;

  // (관리자) 주문 목록 + 페이지네이션 --------------- [추가]
  adminOrderList: OrderItem[];
  totalPageNum: number;
  fetchAdminOrders: (query: AdminOrderQuery) => Promise<void>;
  // --------------------------------------------------

  // 공통 로딩/에러
  isLoading: boolean;
  error: string | null;

  // 선택된 주문(상세 모달)
  selectedOrder: OrderItem | null;
  setSelectedOrder: (order: OrderItem | null) => void;

  // 주문 상태 업데이트
  updateOrderStatus: (args: { id: string; status: OrderStatus }) => Promise<void>;

  // 추가: 결제/주문 생성
  createOrder: (payload: { shipTo: ShipInfo; card: CardValue }) => Promise<string>;
  // void로 해도 되는데, 보통 orderNum 리턴해두면 UI에서 쓰기 편함
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  // 주문번호
  orderNum: "",
  setOrderNum: (orderNum) => set({ orderNum }),
  clearOrderNum: () => set({ orderNum: "" }),

  // (유저) 주문 목록
  orderList: [],

  // (관리자) 주문 목록 + 페이지네이션 --------------- [추가]
  adminOrderList: [],
  totalPageNum: 1,
  // --------------------------------------------------

  // 공통 로딩/에러
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/orders");
      // set({ orderList: res.data });
      // 응답이 배열이면 이거
      set({ orderList: res.data as OrderItem[] });
    } catch (e: any) {
      set({ error: e?.message ?? "주문 조회 오류" });
    } finally {
      set({ isLoading: false });
    }
  },

  clearOrders: () => set({ orderList: [], error: null }),

  // (관리자) 주문 목록 조회
  fetchAdminOrders: async (query) => {
    set({ isLoading: true, error: null });
    try {
      // 엔드포인트는 네 백엔드에 맞춰 수정!
      // 예: GET /orders/admin?page=1&ordernum=...
      const res = await api.get("/orders/admin", { params: query });

      // 응답이 { orderList, totalPageNum } 형태라고 가정
      set({
        adminOrderList: (res.data.orderList ?? []) as OrderItem[],
        totalPageNum: res.data.totalPageNum ?? 1,
      });

      // 만약 응답이 { orders, totalPages }면:
      // set({
      //   adminOrderList: (res.data.orders ?? []) as OrderItem[],
      //   totalPageNum: res.data.totalPages ?? 1,
      // });

      // 만약 응답이 배열만 오면:
      // set({ adminOrderList: res.data as OrderItem[], totalPageNum: 1 });
    } catch (e: any) {
      set({ error: e?.message ?? "관리자 주문 목록 조회 오류" });
    } finally {
      set({ isLoading: false });
    }
  },
  // --------------------------------------- [추가 끝]

  // 선택된 주문
  selectedOrder: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  // 주문 상태 업데이트
  updateOrderStatus: async ({ id, status }) => {
    set({ isLoading: true, error: null });
    try {
      // 여기 엔드포인트는 네 백엔드에 맞춰 수정!
      // 예: PUT /orders/:id
      await api.put(`/orders/${id}`, { status });

      // 목록/선택주문 상태도 즉시 반영
      set((state) => ({
        orderList: state.orderList.map((o) => (o._id === id ? { ...o, status } : o)),
        selectedOrder:
          state.selectedOrder?._id === id
            ? { ...state.selectedOrder, status }
            : state.selectedOrder,
      }));
    } catch (e: any) {
      set({ error: e?.message ?? "주문 상태 변경 오류" });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
  // 추가: 결제/주문 생성
  createOrder: async ({ shipTo, card }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/orders", { shipTo, card });

      const orderNum =
        res.data?.orderNum ?? res.data?.order?.orderNum ?? res.data?.data?.orderNum ?? "";

      set({ orderNum });

      // (선택) 주문 완료 후 내 주문목록 갱신 필요하면
      // await get().fetchOrders();

      return orderNum;
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e?.message ?? "주문 생성 실패" });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
