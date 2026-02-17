import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faBox, faSearch, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";

const ShopNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthed, signout } = useAuthStore();
  const cartList = useCartStore((s) => s.cartList);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const isMobile = useMemo(() => window.matchMedia("(max-width: 768px)").matches, []);

  const menuList = [
    "여성",
    "Divided",
    "남성",
    "신생아/유아",
    "아동",
    "H&M HOME",
    "Sale",
    "지속가능성",
  ];

  // “쇼핑백(숫자)”를 아이템 개수로 할지, qty 합계로 할지 선택 가능
  // 1) 아이템 개수
  const cartItemCount = cartList.length;

  // 2) qty 합계(원하면 이걸로)
  // const cartItemCount = cartList.reduce((sum, it) => sum + (it.qty ?? 0), 0);

  const onCheckEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const value = event.currentTarget.value.trim();
    if (!value) {
      navigate("/");
      return;
    }
    navigate(`/?name=${encodeURIComponent(value)}`);
  };

  const handleLogout = () => {
    signout();
    navigate("/"); // 로그아웃 후 홈으로(원하면 /login)
  };

  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input type="text" placeholder="제품검색" onKeyDown={onCheckEnter} />
            </div>
            <button className="closebtn" type="button" onClick={() => setShowSearchBox(false)}>
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="side-menu" style={{ width }}>
        <button className="closebtn" type="button" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu) => (
            <button key={menu} type="button">
              {menu}
            </button>
          ))}
        </div>
      </div>

      {/* admin 링크 */}
      {isAuthed && user?.role === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}

      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>
        <div className="display-flex">
          {isAuthed ? (
            <div onClick={handleLogout} className="nav-icon" role="button" tabIndex={0}>
              <FontAwesomeIcon icon={faUser} />
              {!isMobile && <span style={{ cursor: "pointer" }}>로그아웃</span>}
            </div>
          ) : (
            <div onClick={() => navigate("/login")} className="nav-icon" role="button" tabIndex={0}>
              <FontAwesomeIcon icon={faUser} />
              {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
            </div>
          )}

          <div onClick={() => navigate("/cart")} className="nav-icon" role="button" tabIndex={0}>
            <FontAwesomeIcon icon={faShoppingBag} />
            {!isMobile && <span style={{ cursor: "pointer" }}>{`쇼핑백(${cartItemCount})`}</span>}
          </div>

          <div
            onClick={() => navigate("/account/purchase")}
            className="nav-icon"
            role="button"
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faBox} />
            {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
          </div>

          {isMobile && (
            <div
              className="nav-icon"
              onClick={() => setShowSearchBox(true)}
              role="button"
              tabIndex={0}
            >
              <FontAwesomeIcon icon={faSearch} />
            </div>
          )}
        </div>
      </div>

      <div className="nav-logo">
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>

      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu) => (
            <li key={menu}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>

        {!isMobile && (
          <div className="search-box landing-search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="제품검색" onKeyDown={onCheckEnter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopNavbar;
