import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../../common/component/SearchBox";
import { useOrderStore } from "../../stores/orderStore";
import type { OrderItem, OrderListItem } from "../../types/order";
import "./style/adminOrder.style.css";

type SearchQuery = {
  page: number;
  ordernum?: string;
};

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const { adminOrderList, totalPageNum, fetchAdminOrders, setSelectedOrder } = useOrderStore(
    (s) => ({
      adminOrderList: s.adminOrderList,
      totalPageNum: s.totalPageNum,
      fetchAdminOrders: s.fetchAdminOrders,
      setSelectedOrder: s.setSelectedOrder,
    }),
  );

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    page: Number(query.get("page") || 1),
    ordernum: query.get("ordernum") || "",
  });

  const [open, setOpen] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  // URL(query)가 바뀌면 검색조건 업데이트 + 목록 호출
  useEffect(() => {
    const next: SearchQuery = {
      page: Number(query.get("page") || 1),
      ordernum: query.get("ordernum") || "",
    };

    // 빈 문자열이면 제거
    if (!next.ordernum) delete next.ordernum;

    setSearchQuery(next);
    fetchAdminOrders(next);
  }, [query, fetchAdminOrders]);

  // searchQuery가 바뀌면 URL을 갱신
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(searchQuery.page));
    if (searchQuery.ordernum) params.set("ordernum", searchQuery.ordernum);

    navigate("?" + params.toString());
  }, [searchQuery, navigate]);

  // ✅ OrderItem[] -> OrderListItem[] 변환 (컴포넌트 안에서!)
  const listData: OrderListItem[] = useMemo(() => {
    const toOrderListItem = (o: OrderItem): OrderListItem | null => {
      const email = o.userId?.email;
      const address = o.shipTo?.address;
      const city = o.shipTo?.city;

      if (!email || !address || !city) return null;

      return {
        ...o,
        userId: { email },
        shipTo: { address, city },
      };
    };

    return adminOrderList.map(toOrderListItem).filter((x): x is OrderListItem => x !== null);
  }, [adminOrderList]);

  const openEditForm = (order: OrderListItem) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 display-center mb-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="오더번호"
            field="ordernum"
          />
        </div>

        <OrderTable
          header={tableHeader}
          // data={adminOrderList}
          data={listData}
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

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrderPage;
