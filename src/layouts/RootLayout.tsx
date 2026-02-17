import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";

import "../App.css";
import { useCartStore } from "../stores/cartStore";
import { useEffect } from "react";
import ShopNavbar from "../common/component/ShopNavbar";

export default function RootLayout() {
  const { isAuthed, signout } = useAuthStore();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed) fetchCart();
  }, [isAuthed, fetchCart]);

  const handleLogout = () => {
    signout();
    navigate("/login"); // "/signin" -> "/login"
  };

  return (
    <>
      <ShopNavbar />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
}
