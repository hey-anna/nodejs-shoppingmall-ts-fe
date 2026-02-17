import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { useOrderStore } from "../../stores/orderStore";
import type { CardValue, CardField } from "../../types/payment";

// import { CardValue } from "../../types/payment";

// export type CardField = "number" | "name" | "expiry" | "cvc";

const PaymentPage = () => {
  const navigate = useNavigate();

  // zustand state/actions
  const { orderNum, createOrder, isLoading, error, clearOrderNum } = useOrderStore();

  const [cardValue, setCardValue] = useState<CardValue>({
    cvc: "",
    expiry: "",
    focus: "number", // "" 말고 기본값 지정
    name: "",
    number: "",
  });

  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    // 오더번호를 받으면 완료/성공 페이지로 이동
    if (orderNum) {
      // 예시: 주문 완료 페이지
      navigate(`/order/complete?orderNum=${orderNum}`);
      // 또는 navigate("/order/complete", { state: { orderNum } });

      // (선택) 다음 결제 진입 시 꼬임 방지
      // clearOrderNum();
    }
  }, [orderNum, navigate]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 간단 검증(원하면 더 강화 가능)
    if (!shipInfo.firstName || !shipInfo.lastName) return;

    try {
      // zustand createOrder 호출
      await createOrder({
        shipTo: shipInfo,
        card: {
          number: cardValue.number,
          name: cardValue.name,
          expiry: cardValue.expiry,
          cvc: cardValue.cvc,
        },
      });
      // orderNum 세팅되면 useEffect가 이동 처리함
    } catch (e) {
      // 에러는 store.error에 들어가 있으니 여기선 선택
      console.error(e);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShipInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // expiry 포맷 자동 적용
    if (name === "expiry") {
      setCardValue((prev) => ({ ...prev, expiry: cc_expires_format(value) }));
      return;
    }

    setCardValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setCardValue((prev) => ({
      ...prev,
      focus: e.target.name as CardField,
    }));
  };

  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>

            {/* 에러 표시 (선택) */}
            {error && <div className="text-danger mb-3">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="lastName">
                  <Form.Label>성</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleFormChange}
                    required
                    name="lastName"
                    value={shipInfo.lastName}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="firstName">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleFormChange}
                    required
                    name="firstName"
                    value={shipInfo.firstName}
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="contact">
                <Form.Label>연락처</Form.Label>
                <Form.Control
                  placeholder="010-xxx-xxxxx"
                  onChange={handleFormChange}
                  required
                  name="contact"
                  value={shipInfo.contact}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>주소</Form.Label>
                <Form.Control
                  placeholder="Apartment, studio, or floor"
                  onChange={handleFormChange}
                  required
                  name="address"
                  value={shipInfo.address}
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    onChange={handleFormChange}
                    required
                    name="city"
                    value={shipInfo.city}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="zip">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    onChange={handleFormChange}
                    required
                    name="zip"
                    value={shipInfo.zip}
                  />
                </Form.Group>
              </Row>

              <div className="mobile-receipt-area">{/* <OrderReceipt /> */}</div>

              <h2 className="payment-title">결제 정보</h2>

              {/* PaymentForm이 있다면 props로 넘겨서 카드 입력을 여기 state에 반영 */}
              <PaymentForm
                cardValue={cardValue}
                // onChange={handlePaymentInfoChange}
                // onFocus={handleInputFocus}
                // cardValue={cardValue}
                handlePaymentInfoChange={handlePaymentInfoChange}
                handleInputFocus={handleInputFocus}
              />

              <Button
                variant="dark"
                className="payment-button pay-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "결제 처리중..." : "결제하기"}
              </Button>
            </Form>
          </div>
        </Col>

        <Col lg={5} className="receipt-area">
          {/* <OrderReceipt /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
