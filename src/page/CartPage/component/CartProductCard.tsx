import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currencyFormat } from "../../../utils/number";
import { useCartStore } from "../../../stores/cartStore";
import type { CartItem } from "../../../api/cartApi";

type Props = { item: CartItem };

const CartProductCard = ({ item }: Props) => {
  const updateQty = useCartStore((s) => s.updateQty);
  const deleteItem = useCartStore((s) => s.deleteItem);

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>

        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button type="button" className="trash-button" onClick={() => deleteItem(item._id)}>
              <FontAwesomeIcon icon={faTrash} width={24} />
            </button>
          </div>

          <div>
            <strong>₩ {currencyFormat(item.productId.price)}</strong>
          </div>

          <div>Size: {item.size}</div>
          <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>

          <div>
            Quantity:
            <Form.Select
              className="qty-dropdown"
              value={item.qty}
              onChange={(e) => updateQty(item._id, Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
