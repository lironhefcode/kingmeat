import { Link } from "react-router";
import { useCart } from "../cart/CartContext";
import { CloseIcon } from "./Icons";
import { Modal } from "./Modal";
import { Price } from "./Price";
import { QtyStepper } from "./QtyStepper";
import "./CartDrawer.css";

export function CartLines({ lines, setQty }) {
  return (
    <ul className="cart-lines">
      {lines.map((line) => (
        <li key={line.key} className="cart-line">
          <img src={line.item.image} alt="" width="72" height="54" loading="lazy" />
          <div className="cart-line-main">
            <p className="cart-line-name">{line.item.name}</p>
            {line.details.map((d) => (
              <p key={d} className="cart-line-detail">{d}</p>
            ))}
            <div className="cart-line-foot">
              <QtyStepper value={line.qty} onChange={(q) => setQty(line.key, q)} label={line.item.name} removable />
              <Price value={line.total} className="cart-line-price" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, setQty } = useCart();

  return (
    <Modal open={drawerOpen} onClose={closeDrawer} className="drawer" labelledBy="cart-title">
      <div className="drawer-inner">
        <div className="drawer-head">
          <h2 id="cart-title" className="drawer-title">הסל שלך</h2>
          <button type="button" className="icon-btn" onClick={closeDrawer} aria-label="סגירת הסל">
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p>הסל ריק. בחרו משהו מהתפריט והוא יופיע כאן.</p>
            <Link className="btn btn-red" to="/menu" onClick={closeDrawer}>לתפריט</Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <CartLines lines={lines} setQty={setQty} />
            </div>
            <div className="drawer-foot">
              <p className="drawer-total">
                <span>סכום ביניים</span>
                <Price value={subtotal} className="drawer-total-price" />
              </p>
              <Link className="btn btn-red btn-block" to="/checkout" onClick={closeDrawer}>
                להמשך לתשלום
              </Link>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
