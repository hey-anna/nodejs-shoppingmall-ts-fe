// src/routes/router.tsx

import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import LandingPage from "../page/LandingPage/LandingPage";
import LoginPage from "../page/LoginPage/LoginPage";
import RegisterPage from "../page/RegisterPage/RegisterPage";
import ProductDetailPage from "../page/ProductDetailPage/ProductDetailPage";

import CartPage from "../page/CartPage/CartPage";
import PaymentPage from "../page/PaymentPage/PaymentPage";
import OrderCompletePage from "../page/OrderCompletePage/OrderCompletePage";
import MyPage from "../page/MyPage/MyPage";

import AdminProductPage from "../page/AdminProductPage/AdminProductPage";
import AdminOrderPage from "../page/AdminOrderPage/AdminOrderPage";

import RequireAuth from "../auth/RequireAuth";

// import PrivateRoute from "./PrivateRoute";

// (선택) 나중에 에러 페이지 만들면 여기 연결
// import NotFoundPage from "../page/NotFoundPage/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // 공개 라우트
      { index: true, element: <LandingPage /> }, // "/"
      { path: "login", element: <LoginPage /> }, // "/login"
      { path: "register", element: <RegisterPage /> }, // "/register"
      { path: "product/:id", element: <ProductDetailPage /> }, // "/product/:id"

      // 고객 전용 라우트
      {
        element: <RequireAuth permissionLevel="customer" />,
        children: [
          { path: "cart", element: <CartPage /> }, // "/cart"
          { path: "payment", element: <PaymentPage /> }, // "/payment"
          { path: "payment/success", element: <OrderCompletePage /> }, // "/payment/success"
          { path: "account/purchase", element: <MyPage /> }, // "/account/purchase"
        ],
      },

      // 관리자 전용 라우트
      {
        element: <RequireAuth permissionLevel="admin" />,
        children: [
          { path: "admin/product", element: <AdminProductPage /> }, // "/admin/product"
          { path: "admin/order", element: <AdminOrderPage /> }, // "/admin/order"
        ],
      },

      // (선택) 404
      // { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
