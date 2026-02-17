import { useEffect, useState } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { ORDER_STATUS, type OrderStatus } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { useOrderStore } from "../../../stores/orderStore";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const OrderDetailDialog = ({ open, handleClose }: Props) => {
  const selectedOrder = useOrderStore((s) => s.selectedOrder);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [orderStatus, setOrderStatus] = useState<OrderStatus>("preparing");

  // ✅ selectedOrder가 바뀌면 상태 동기화
  useEffect(() => {
    if (selectedOrder?.status) setOrderStatus(selectedOrder.status);
  }, [selectedOrder]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(event.target.value as OrderStatus);
  };

  const submitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await updateOrderStatus({ id: selectedOrder._id, status: orderStatus });
    handleClose();
  };

  if (!selectedOrder) return null;

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Detail</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>예약번호: {selectedOrder.orderNum}</p>
        <p>주문날짜: {selectedOrder.createdAt.slice(0, 10)}</p>

        {/* 아래 필드들은 OrderItem 타입에 없으면 optional chaining으로 안전 처리 */}
        <p>이메일: {selectedOrder.userId?.email}</p>
        <p>
          주소: {selectedOrder.shipTo?.address} {selectedOrder.shipTo?.city}
        </p>
        <p>
          연락처: {selectedOrder.contact?.firstName}
          {selectedOrder.contact?.lastName} {selectedOrder.contact?.contact}
        </p>

        <p>주문내역</p>
        <div className="overflow-x">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {selectedOrder.items?.length > 0 &&
                selectedOrder.items.map((item: any) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.productId?.name}</td>
                    <td>{currencyFormat(item.price)}</td>
                    <td>{item.qty}</td>
                    <td>{currencyFormat(item.price * item.qty)}</td>
                  </tr>
                ))}

              <tr>
                <td colSpan={4}>총계:</td>
                <td>{currencyFormat(selectedOrder.totalPrice)}</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <Form onSubmit={submitStatus}>
          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>

            <Form.Select value={orderStatus} onChange={handleStatusChange}>
              {ORDER_STATUS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="order-button-area">
            <Button variant="light" onClick={handleClose} className="order-button">
              닫기
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
