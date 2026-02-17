// src/page/AdminProductPage/component/NewItemDialog.tsx
import { useEffect, useMemo, useState } from "react";
import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";

import { useProductStore } from "../../../stores/productStore";
import type { ProductForm } from "../../../types/product";

type Mode = "new" | "edit";

type Props = {
  mode: Mode;
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
};

type StockRow = [string, number]; // ["m", 2] 형태

const INITIAL_FORM: ProductForm = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }: Props) => {
  const { selectedProduct, isLoading, error, success, createProduct, editProduct, clearSuccess } =
    useProductStore((s) => ({
      selectedProduct: s.selectedProduct,
      isLoading: s.isLoading,
      error: s.error,
      success: s.success,
      createProduct: s.createProduct,
      editProduct: s.editProduct,
      clearSuccess: s.clearSuccess,
    }));

  const [formData, setFormData] = useState<ProductForm>({ ...INITIAL_FORM });
  const [stock, setStock] = useState<StockRow[]>([]);
  const [stockError, setStockError] = useState(false);

  // edit 모드일 때 현재 선택된 상품 id
  const editingId = useMemo(() => selectedProduct?._id, [selectedProduct]);

  // 성공 시 모달 닫고 success 플래그 리셋
  useEffect(() => {
    if (!success) return;
    setShowDialog(false);
    clearSuccess();
  }, [success, setShowDialog, clearSuccess]);

  // 다이얼로그 열릴 때 초기화/세팅
  useEffect(() => {
    if (!showDialog) return;

    setStockError(false);

    if (mode === "edit" && selectedProduct) {
      setFormData({
        ...selectedProduct,
        // 혹시 서버에서 없는 값이 올 수도 있으니 방어
        category: selectedProduct.category ?? [],
        status: selectedProduct.status ?? "active",
      });

      const sizeArray: StockRow[] = Object.keys(selectedProduct.stock ?? {}).map((size) => [
        size,
        Number((selectedProduct.stock as any)[size]) ?? 0,
      ]);
      setStock(sizeArray);
    } else {
      setFormData({ ...INITIAL_FORM });
      setStock([]);
    }
  }, [showDialog, mode, selectedProduct]);

  const handleClose = () => {
    setShowDialog(false);
    setStockError(false);
    // 필요하면 여기서 selectedProduct를 null로도 초기화 가능:
    // useProductStore.getState().setSelectedProduct(null);
  };

  // 일반 input change
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = event.target;

    setFormData((prev) => {
      // price는 number로
      if (id === "price") return { ...prev, price: Number(value) };
      // status는 "active" | "inactive" 문자열
      if (id === "status") return { ...prev, status: value as any };

      return { ...prev, [id]: value };
    });
  };

  // stock row 추가
  const addStock = () => {
    setStockError(false);
    setStock((prev) => [...prev, ["", 0]]);
  };

  const deleteStock = (idx: number) => {
    setStock((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSizeChange = (value: string, index: number) => {
    setStock((prev) => prev.map((row, i) => (i === index ? [value.toLowerCase(), row[1]] : row)));
  };

  const handleStockChange = (value: string, index: number) => {
    const qty = Number(value);
    setStock((prev) => prev.map((row, i) => (i === index ? [row[0], qty] : row)));
  };

  // category (multi select / 토글)
  const onHandleCategory = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const v = event.target.value;

    setFormData((prev) => {
      const has = prev.category.includes(v);
      return {
        ...prev,
        category: has ? prev.category.filter((c) => c !== v) : [...prev.category, v],
      };
    });
  };

  // Cloudinary 업로드 콜백
  const uploadImage = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // stock 필수 체크
    if (stock.length === 0) {
      setStockError(true);
      return;
    }

    // stock 배열 -> 객체 변환
    // [["m",2],["l",1]] => { m:2, l:1 }
    const stockObj = stock.reduce<Record<string, number>>((acc, [size, qty]) => {
      if (!size) return acc;
      acc[size] = Number(qty) || 0;
      return acc;
    }, {});

    if (Object.keys(stockObj).length === 0) {
      setStockError(true);
      return;
    }

    const payload: ProductForm = {
      ...formData,
      stock: stockObj,
    };

    if (mode === "new") {
      await createProduct(payload);
    } else {
      if (!editingId) return;
      await editProduct(editingId, payload);
    }
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "new" ? "Create New Product" : "Edit Product"}</Modal.Title>
      </Modal.Header>

      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}

      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              id="sku"
              onChange={handleChange}
              type="text"
              placeholder="Enter Sku"
              required
              value={formData.sku}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              id="name"
              onChange={handleChange}
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              disabled={isLoading}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            id="description"
            type="text"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
            disabled={isLoading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && <span className="error-message">재고를 추가해주세요</span>}
          <Button size="sm" onClick={addStock} type="button" disabled={isLoading}>
            Add +
          </Button>

          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index}>
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) => handleSizeChange(event.target.value, index)}
                    required
                    value={item[0] ?? ""}
                    disabled={isLoading}
                  >
                    <option value="" disabled hidden>
                      Please Choose...
                    </option>

                    {SIZE.map((s, idx) => {
                      const v = s.toLowerCase();
                      const alreadyUsed = stock.some((row, i) => i !== index && row[0] === v);

                      return (
                        <option value={v} disabled={alreadyUsed} key={idx}>
                          {s}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>

                <Col sm={6}>
                  <Form.Control
                    onChange={(event) => handleStockChange(event.target.value, index)}
                    type="number"
                    placeholder="number of stock"
                    value={item[1]}
                    required
                    disabled={isLoading}
                  />
                </Col>

                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                    type="button"
                    disabled={isLoading}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image">
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget onUpload={uploadImage} />

          <img
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2"
            alt="uploadedimage"
          />
          {/* 이미지 업로드 필수 체크용: 숨은 input */}
          <Form.Control
            type="text"
            value={formData.image}
            onChange={() => {}}
            required
            style={{ display: "none" }}
            readOnly
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              id="price"
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              onChange={onHandleCategory}
              value={formData.category}
              required
              disabled={isLoading}
            >
              {CATEGORY.map((c, idx) => (
                <option key={idx} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              id="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              {STATUS.map((s, idx) => (
                <option key={idx} value={s.toLowerCase()}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {mode === "new" ? "Submit" : "Edit"}
        </Button>
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
