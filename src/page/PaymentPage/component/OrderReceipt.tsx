import { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { useCartStore } from "../../../stores/cartStore";

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartList } = useCartStore();

  const { itemsTotal, shippingFee, grandTotal } = useMemo(() => {
    const itemsTotal =
      cartList?.reduce((sum, item) => sum + item.productId.price * item.qty, 0) ?? 0;

    // 정책 있으면 여기서 계산/또는 서버값 사용
    const shippingFee = itemsTotal > 0 ? 0 : 0;

    return {
      itemsTotal,
      shippingFee,
      grandTotal: itemsTotal + shippingFee,
    };
  }, [cartList]);

  const showContinueBtn = location.pathname.includes("/cart") && (cartList?.length ?? 0) > 0;

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>

      <ul className="receipt-list">
        {(cartList ?? []).map((item) => (
          <li key={item._id ?? item.productId}>
            <div className="display-flex space-between">
              <div>
                {item.productId.name}
                {item.size ? ` (${item.size})` : ""}
                <span className="ms-2 text-muted">x {item.qty}</span>
              </div>

              <div>₩ {currencyFormat(item.productId.price * item.qty)}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="display-flex space-between receipt-title">
        <div>상품 합계</div>
        <div>₩ {currencyFormat(itemsTotal)}</div>
      </div>

      <div className="display-flex space-between receipt-title">
        <div>배송비</div>
        <div>₩ {currencyFormat(shippingFee)}</div>
      </div>

      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(grandTotal)}</strong>
        </div>
      </div>

      {showContinueBtn && (
        <Button variant="dark" className="payment-button" onClick={() => navigate("/payment")}>
          결제 계속하기
        </Button>
      )}

      <div className="mt-3 text-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
        가능한 결제 수단: 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는 확인되지 않습니다.
        <div className="mt-2">
          30일의 반품 가능 기간, 반품 수수료 및 미수취 시 발생하는 추가 배송 요금 읽어보기: 반품 및
          환불
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
