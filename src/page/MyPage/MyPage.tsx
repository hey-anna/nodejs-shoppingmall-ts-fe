// MyPage.tsx
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { useOrderStore } from "../../stores/orderStore";

const MyPage = () => {
  const { orderList, isLoading, error, fetchOrders } = useOrderStore((s) => ({
    orderList: s.orderList,
    isLoading: s.isLoading,
    error: s.error,
    fetchOrders: s.fetchOrders,
  }));

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <Container className="no-order-box">
        <div>불러오는 중...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="no-order-box">
        <div>{error}</div>
      </Container>
    );
  }

  if (orderList.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }

  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard key={item._id} orderItem={item} className="status-card-container" />
      ))}
    </Container>
  );
};

export default MyPage;
