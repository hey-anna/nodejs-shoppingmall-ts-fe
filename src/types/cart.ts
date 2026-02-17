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

export interface CartResponse {
  cartList: CartItem[];
  totalPrice?: number;
}
