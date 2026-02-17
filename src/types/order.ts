// src/types/order.ts
import type { OrderStatus } from "../constants/order.constants";

export type OrderLineItem = {
  _id: string;
  productId: {
    name: string;
    image: string;
  };
  price: number;
  qty: number;
};

// export type OrderItem = {
//   _id: string;
//   orderNum: string;
//   createdAt: string;
//   totalPrice: number;
//   status: OrderStatus;
//   items: Array<{
//     productId: {
//       name: string;
//       image: string;
//     };
//   }>;
// };

export type OrderUser = { email: string };
export type OrderShipTo = { address: string; city: string };

export type OrderItem = {
  _id: string;
  orderNum: string;
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderLineItem[];

  // 관리자 상세에서 쓰는 필드들 (있으면 넣고, 없으면 optional)
  userId?: { email?: string };
  shipTo?: { address?: string; city?: string };
  contact?: { firstName?: string; lastName?: string; contact?: string };
};

//  "관리자 주문 목록"에서 필요한 필드만 확정 타입으로
export type OrderListItem = Omit<OrderItem, "userId" | "shipTo"> & {
  userId: OrderUser;
  shipTo: OrderShipTo;
};
