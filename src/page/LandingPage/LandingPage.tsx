import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { getProductListApi } from "../../api/productApi";
import type { Product } from "../../types/product";

// 카드에서 필요한 최소 필드만
type ProductCardItem = Pick<Product, "_id" | "image" | "name" | "price">;

const LandingPage = () => {
  // const productList = useSelector((state: RootState) => state.product.productList);
  // const [productList, setProductList] = useState<Product[]>([]);
  const [productList, setProductList] = useState<ProductCardItem[]>([]);
  const [query] = useSearchParams();

  // query.get()은 string | null
  const name = query.get("name") ?? "";

  useEffect(() => {
    const fetchProducts = async () => {
      // api가 정규화해서 { productList }로 준다는 전제
      const { productList } = await getProductListApi({ name: name || undefined });
      setProductList(productList);
    };

    fetchProducts();
  }, [name]);

  return (
    <Container>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
