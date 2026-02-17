import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import SearchBox from "../../common/component/SearchBox";
import ProductTable from "./component/ProductTable";

import { useProductStore } from "../../stores/productStore";
import type { Product } from "../../types/product";

import NewItemDialog from "./component/NewItemDialog";

type SearchQuery = {
  page: number;
  name?: string;
};

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const { productList, totalPageNum, fetchProducts, deleteProduct, setSelectedProduct } =
    useProductStore((s) => ({
      productList: s.productList,
      totalPageNum: s.totalPageNum,
      fetchProducts: s.fetchProducts,
      deleteProduct: s.deleteProduct,
      setSelectedProduct: s.setSelectedProduct,
    }));

  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    page: Number(query.get("page") || 1),
    name: query.get("name") || "",
  });

  const tableHeader = ["#", "Sku", "Name", "Price", "Stock", "Image", "Status", ""];

  // URL(query)가 바뀌면 → state + 목록 fetch
  useEffect(() => {
    const next: SearchQuery = {
      page: Number(query.get("page") || 1),
      name: query.get("name") || "",
    };

    if (!next.name) delete next.name;

    setSearchQuery(next);
    fetchProducts(next);
  }, [query, fetchProducts]);

  // state(searchQuery)가 바뀌면 → URL 반영
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(searchQuery.page));
    if (searchQuery.name) params.set("name", searchQuery.name);

    navigate("?" + params.toString());
  }, [searchQuery, navigate]);

  const deleteItem = async (id: string) => {
    // 원하면 confirm 넣기
    // if (!confirm("삭제할까요?")) return;
    await deleteProduct(id);
  };

  const openEditForm = (product: Product) => {
    setMode("edit");
    setSelectedProduct(product);
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    setMode("new");
    setSelectedProduct(null);
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>

        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />

        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog mode={mode} showDialog={showDialog} setShowDialog={setShowDialog} />
    </div>
  );
};

export default AdminProductPage;
