import { Link } from "react-router";
import { RESTAURANT, telHref } from "../data/restaurant";
import { HoursList } from "./HoursList";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="" width="88" height="88" loading="lazy" />
          <div>
            <p className="footer-name">{RESTAURANT.name}</p>
            <p>{RESTAURANT.tagline}. כשר, {RESTAURANT.kosherNote}.</p>
          </div>
        </div>

        <div>
          <h2 className="footer-heading">סניפים</h2>
          <ul className="footer-list">
            {RESTAURANT.branches.map((b) => (
              <li key={b.id}>{b.street}, {b.city}</li>
            ))}
          </ul>
          <p className="footer-phone">
            <a href={telHref(RESTAURANT.phone)} dir="ltr">{RESTAURANT.phone}</a>
          </p>
        </div>

        {RESTAURANT.branches
          .filter((b) => b.hours.length)
          .map((b) => (
            <div key={b.id}>
              <h2 className="footer-heading">שעות פתיחה, {b.city}</h2>
              <HoursList hours={b.hours} className="footer-list" />
            </div>
          ))}

        <nav aria-label="קישורים">
          <ul className="footer-list">
            <li><Link to="/menu">תפריט והזמנה</Link></li>
            <li><Link to="/about">אודות</Link></li>
            <li><Link to="/checkout">לתשלום</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container">
        <p className="footer-copy">© {new Date().getFullYear()} {RESTAURANT.name}</p>
      </div>
    </footer>
  );
}
