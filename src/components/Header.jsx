import { Link, NavLink, useLocation } from "react-router";
import { useCart } from "../cart/CartContext";
import { RESTAURANT } from "../data/restaurant";
import { BagIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import "./Header.css";

export function Header() {
  const { count, openDrawer } = useCart();
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label={`${RESTAURANT.name}, לדף הבית`}>
          <img src="/images/logo.png" alt="" width="44" height="44" />
          <span className="brand-name">{RESTAURANT.name}</span>
        </Link>
        <nav className="site-nav" aria-label="ניווט ראשי">
          <NavLink to="/menu">תפריט</NavLink>
          <NavLink to="/about">אודות</NavLink>
        </nav>
        {pathname !== "/menu" && (
          <Link className="btn btn-red btn-small header-order" to="/menu">הזמינו עכשיו</Link>
        )}
        <ThemeToggle />
        <button
          type="button"
          className="cart-btn"
          onClick={openDrawer}
          aria-label={count ? `סל הקניות, ${count} פריטים` : "סל הקניות, ריק"}
        >
          <BagIcon />
          {count > 0 && <span className="cart-count">{count}</span>}
        </button>
      </div>
    </header>
  );
}
