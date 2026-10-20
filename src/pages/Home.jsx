import { Link } from "react-router";
import { HoursList } from "../components/HoursList";
import { CrownIcon } from "../components/Icons";
import { Price, priceText } from "../components/Price";
import { WavePanel } from "../components/WavePanel";
import { ADD_INS, CATEGORIES, IN_EVERY_SANDWICH, SIDE_SAUCE_NAMES } from "../data/menu";
import { RESTAURANT, telHref } from "../data/restaurant";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Home.css";

// Side portions of meat are an add-on, not a reason to open the menu
const HOME_CATEGORIES = CATEGORIES.filter((c) => c.id !== "portions");
const lowestPrice = (c) => Math.min(...c.items.map((i) => i.price));
const wazeHref = (b) => `https://waze.com/ul?q=${encodeURIComponent(`${b.street} ${b.city}`)}&navigate=yes`;

export function Home() {
  usePageTitle();
  return (
    <>
      <WavePanel className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1 id="hero-title" className="hero-title">
              <span className="line"><span>כריך</span></span>
              <span className="line"><span>אנטריקוט</span></span>
              <span className="line line-small"><span>דרום אמריקאי</span></span>
            </h1>
            <p className="hero-lead">רצועות אנטריקוט מהגריל בג'בטה מתנור לבנים, עם צ'ימיצ'ורי ואבוקדו.</p>
            <div className="hero-actions">
              <Link className="btn btn-black" to="/menu">להזמנה אונליין</Link>
              <Link className="link-bar" to="/about">על קינג מיט</Link>
            </div>
            <p className="kosher">
              <CrownIcon className="crown" />
              כשר
              <span className="kosher-note">{RESTAURANT.kosherNote}</span>
            </p>
          </div>
          <div className="hero-media">
            <img
              src="/images/sandwich-meat.jpg"
              alt="כריך קינג מיט: אנטריקוט, מלפפון חמוץ, עגבנייה, בצל סגול וחסה בג'בטה, עם צ'ימיצ'ורי בצד"
              width="1600"
              height="1067"
              fetchPriority="high"
            />
          </div>
        </div>
      </WavePanel>

      <section className="home-cats" aria-labelledby="cats-title">
        <div className="container">
          <h2 id="cats-title" className="section-title home-center">מה בא לכם להזמין?</h2>
          <ul className="cat-grid">
            {HOME_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link className="cat-tile" to={`/menu#${c.id}`}>
                  <img src={c.image} alt="" width="900" height="600" loading="lazy" />
                  <span className="cat-name">{c.title}</span>
                  <span className="cat-from" aria-label={`החל מ־${priceText(lowestPrice(c))}`}>
                    החל מ־<Price value={lowestPrice(c)} plain />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="feature" aria-labelledby="feature-title">
        <div className="container feature-inner">
          <img
            className="feature-img"
            src="/images/sandwich-burger.jpg"
            alt="כריך קינג בורגר בג'בטה"
            width="1600"
            height="1067"
            loading="lazy"
          />
          <h2 id="feature-title" className="feature-title">עסקית ב־85 ₪</h2>
          <p className="feature-sub">כריך או טורטייה, צ'יפס ופחית לבחירה.</p>
          <Link className="link-bar" to="/menu#combos">לעסקיות</Link>
        </div>
      </section>

      <section className="inside" aria-labelledby="inside-title">
        <div className="container">
          <div className="inside-panel">
            <div className="inside-text">
              <h2 id="inside-title" className="section-title">מה יש בפנים</h2>
              <div className="inside-block">
                <h3>בכל כריך</h3>
                <ul className="tags">
                  {IN_EVERY_SANDWICH.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p>לא בא לכם משהו? אפשר להוריד כל רכיב בהזמנה.</p>
              </div>
              <div className="inside-block">
                <h3>להוסיף בפנים</h3>
                <ul className="tags">
                  {ADD_INS.map((o) => (
                    <li key={o.id}>
                      {o.label}
                      {o.price > 0 && <span className="tag-price">{priceText(o.price)}</span>}
                    </li>
                  ))}
                </ul>
                <p>עד שש תוספות בכל מנה.</p>
              </div>
              <div className="inside-block">
                <h3>רטבים בצד</h3>
                <ul className="tags">
                  {SIDE_SAUCE_NAMES.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p>כל רוטב בצד 2 ₪.</p>
              </div>
            </div>
            <figure className="inside-media">
              <img src="/images/half.jpg" alt="איולי קארי נסחט על המבורגר בתוך ג'בטה פתוחה" width="900" height="877" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>

      <section className="branches" aria-labelledby="branches-title">
        <div className="container">
          <h2 id="branches-title" className="section-title home-center">איפה אנחנו</h2>
          <div className="branches-grid">
            {RESTAURANT.branches.map((b) => (
              <div key={b.id} className="branch">
                <h3 className="branch-city">{b.city}</h3>
                <p className="branch-street">{b.street}</p>
                {b.hours.length > 0 && <HoursList hours={b.hours} className="branch-hours" />}
                <a className="link-bar" href={wazeHref(b)} target="_blank" rel="noreferrer">
                  ניווט בוויז
                </a>
              </div>
            ))}
            <div className="branch">
              <h3 className="branch-city">הזמנות</h3>
              <p className="branch-street">
                <a href={telHref(RESTAURANT.phone)} dir="ltr">{RESTAURANT.phone}</a>
              </p>
              <Link className="btn btn-red btn-small" to="/menu">להזמנה אונליין</Link>
            </div>
          </div>
        </div>
      </section>

      <WavePanel edge="top" className="order-band" aria-labelledby="order-title">
        <div className="container order-inner">
          <h2 id="order-title" className="order-title">רעבים?</h2>
          <p>בוחרים מנה, תוספות ורטבים, ומקבלים באיסוף או במשלוח.</p>
          <Link className="btn btn-black" to="/menu">להזמנה אונליין</Link>
        </div>
      </WavePanel>
    </>
  );
}
