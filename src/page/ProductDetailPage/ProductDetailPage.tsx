import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";

import { getProductDetailApi } from "../../api/productApi";
import type { Product } from "../../types/product";

import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isAuthed = useAuthStore((s) => s.isAuthed);

  const addToCart = useCartStore((s) => s.addToCart);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductDetailApi(id);
        setSelectedProduct(data);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const selectSize = (value: string | null) => {
    if (!value) return;
    setSize(value);
    setSizeError(false);
  };

  const addItemToCart = async () => {
    // 1) 사이즈 체크
    if (!size) {
      setSizeError(true);
      return;
    }

    // 2) 로그인 체크
    if (!isAuthed) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    // 3) 카트 담기
    if (!selectedProduct) return;

    try {
      await addToCart(selectedProduct._id, size, 1);
      navigate("/cart");
    } catch (e) {
      // 여기서 toast/snackbar로 바꿔도 됨
      alert(e instanceof Error ? e.message : "장바구니 담기에 실패했어요.");
    }
  };

  if (loading || !selectedProduct) {
    return (
      <div className="d-flex justify-content-center py-5">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  }
  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img src={selectedProduct.image} className="w-100" alt="image" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{selectedProduct.name}</div>
          <div className="product-info">₩ {currencyFormat(selectedProduct.price)}</div>
          <div className="product-info">{selectedProduct.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            title={size}
            align="start"
            onSelect={selectSize}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              // align="start"
            >
              {size === "" ? "사이즈 선택" : size.toUpperCase()}
            </Dropdown.Toggle>

            {/* <Dropdown.Menu className="size-drop-down">
              {Object.keys(selectedProduct.stock).length > 0 &&
                Object.keys(selectedProduct.stock).map((item, index) =>
                  selectedProduct.stock[item] > 0 ? (
                    <Dropdown.Item eventKey={item} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item eventKey={item} disabled={true} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ),
                )}
            </Dropdown.Menu> */}
            <Dropdown.Menu className="size-drop-down">
              {Object.keys(selectedProduct.stock).map((key) =>
                (selectedProduct.stock[key] ?? 0) > 0 ? (
                  <Dropdown.Item eventKey={key} key={key}>
                    {key.toUpperCase()}
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item eventKey={key} disabled key={key}>
                    {key.toUpperCase()}
                  </Dropdown.Item>
                ),
              )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">{sizeError && "사이즈를 선택해주세요."}</div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
