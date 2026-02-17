import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { useCartStore } from "../../stores/cartStore";
const CartPage = () => {
  const { cartList, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          {cartList.length > 0 ? (
            cartList.map((item) => <CartProductCard item={item} key={item._id} />)
          ) : (
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          )}
        </Col>

        <Col xs={12} md={5}>
          <OrderReceipt />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
