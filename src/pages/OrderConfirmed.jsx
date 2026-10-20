import { Link, useLocation, useParams } from "react-router";
import { getOrder } from "../api/orders";
import { CrownIcon } from "../components/Icons";
import { Price } from "../components/Price";
import { RESTAURANT, telHref } from "../data/restaurant";
import { usePageTitle } from "../hooks/usePageTitle";
import "./OrderConfirmed.css";

export function OrderConfirmed() {
  usePageTitle("ההזמנה התקבלה");
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order ?? getOrder(id);

  if (!order) {
    return (
      <div className="container confirmed">
        <h1 className="page-title">לא מצאנו את ההזמנה</h1>
        <p className="lead">
          ייתכן שהקישור ישן. לשאלות על הזמנה, התקשרו אלינו:{" "}
          <a href={telHref(RESTAURANT.phone)} dir="ltr">{RESTAURANT.phone}</a>
        </p>
        <Link className="btn btn-red" to="/menu">לתפריט</Link>
      </div>
    );
  }

  const where =
    order.fulfillment === "pickup"
      ? `סניף ${order.branch.city}, ${order.branch.street}`
      : [order.address.street, order.address.city, order.address.apartment].filter(Boolean).join(", ");

  return (
    <div className="container confirmed">
      <CrownIcon className="confirmed-crown" />
      <h1 className="page-title">ההזמנה התקבלה</h1>
      <p className="confirmed-number">
        מספר הזמנה <strong dir="ltr">{order.id}</strong>
      </p>

      <dl className="confirmed-facts">
        <div>
          <dt>{order.fulfillment === "pickup" ? "איסוף" : "משלוח"}</dt>
          <dd>{where}</dd>
        </div>
        <div>
          <dt>מתי</dt>
          <dd>{order.time ? `בשעה ${order.time}` : "כמה שיותר מהר"}</dd>
        </div>
        <div>
          <dt>תשלום</dt>
          <dd>{order.payment === "card" ? "כרטיס אשראי" : "מזומן"}</dd>
        </div>
        <div>
          <dt>עדכונים לטלפון</dt>
          <dd dir="ltr">{order.customer.phone}</dd>
        </div>
      </dl>

      <ul className="confirmed-lines">
        {order.lines.map((l) => (
          <li key={l.key}>
            <div>
              <p className="confirmed-line-name">
                {l.name}
                {l.qty > 1 && <span className="confirmed-qty"> ×{l.qty}</span>}
              </p>
              {l.details.map((d) => (
                <p key={d} className="confirmed-line-detail">{d}</p>
              ))}
            </div>
            <Price value={l.total} plain />
          </li>
        ))}
      </ul>
      <p className="confirmed-total">
        <span>סה"כ</span>
        <Price value={order.total} />
      </p>

      <p className="confirmed-help">
        שאלות על ההזמנה? <a href={telHref(RESTAURANT.phone)} dir="ltr">{RESTAURANT.phone}</a>
      </p>
      <Link className="btn btn-outline" to="/menu">חזרה לתפריט</Link>
    </div>
  );
}
