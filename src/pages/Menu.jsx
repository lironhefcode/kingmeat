import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart/CartContext";
import { PlusIcon, SearchIcon } from "../components/Icons";
import { ItemDialog } from "../components/ItemDialog";
import { Price, priceText } from "../components/Price";
import { WavePanel } from "../components/WavePanel";
import { CATEGORIES, getItem } from "../data/menu";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Menu.css";

const matches = (item, category, q) => `${item.name} ${item.sub ?? ""} ${category.title}`.includes(q);

// Dishes with options open the dish window; everything else goes straight into the cart
function ProductTile({ item, onOpen, onAdd }) {
  const hasOptions = item.groups.length > 0;
  const sub = item.sub ?? item.desc;
  return (
    <button
      type="button"
      className="tile"
      onClick={() => (hasOptions ? onOpen(item.id) : onAdd(item.id))}
      aria-label={
        hasOptions
          ? `${item.name}, ${priceText(item.price)}, לבחירת תוספות`
          : `הוספת ${item.name} לסל, ${priceText(item.price)}`
      }
    >
      <span className="tile-media">
        <img src={item.image} alt="" width="900" height="600" loading="lazy" />
        {item.badge && <span className="badge tile-badge">{item.badge}</span>}
      </span>
      <span className="tile-name">{item.name}</span>
      {sub && <span className="tile-sub">{sub}</span>}
      <span className="tile-foot">
        <Price value={item.price} className="tile-price" />
        <span className="tile-plus"><PlusIcon /></span>
      </span>
    </button>
  );
}

// The active category is the last one whose heading has scrolled past the top third of the screen
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join();
  useEffect(() => {
    const sectionIds = key.split(",");
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}

export function Menu() {
  usePageTitle("תפריט");
  const { add } = useCart();
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const railRef = useRef(null);

  const q = query.trim();
  const sections = CATEGORIES.map((c) => ({ ...c, items: q ? c.items.filter((i) => matches(i, c, q)) : c.items })).filter(
    (c) => c.items.length > 0
  );
  const activeSection = useActiveSection(sections.map((c) => c.id));

  // On phones the rail is a horizontal strip; keep the active chip in view
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector(".is-active");
    if (!chip || rail.scrollWidth <= rail.clientWidth) return;
    const railBox = rail.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < railBox.left || chipBox.right > railBox.right) {
      rail.scrollBy({ left: chipBox.left - railBox.left - (railBox.width - chipBox.width) / 2 });
    }
  }, [activeSection]);

  return (
    <>
      <WavePanel className="menu-panel">
        <div className="container panel-head menu-panel-inner">
          <div>
            <h1 className="page-title">תפריט</h1>
            <p className="panel-lead">בוחרים מנה, מוסיפים לסל ומשלמים אונליין. איסוף מהסניף או משלוח.</p>
          </div>
          <label className="menu-search">
            <SearchIcon />
            <span className="visually-hidden">חיפוש בתפריט</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="איזו מנה לחפש?" />
          </label>
        </div>
      </WavePanel>

      <div className="container menu-layout after-panel">
        <nav className="menu-rail" aria-label="קטגוריות בתפריט" ref={railRef}>
          {sections.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={c.id === activeSection ? "is-active" : undefined}
              aria-current={c.id === activeSection ? "true" : undefined}
            >
              <img src={c.image} alt="" width="48" height="48" loading="lazy" />
              <span>{c.title}</span>
            </a>
          ))}
        </nav>

        <div className="menu-body">
          {sections.length === 0 && (
            <div className="menu-empty" role="status">
              <p>לא מצאנו מנה עם „{q}”. נסו מילה אחרת, למשל צ'יקן או צ'יפס.</p>
              <button type="button" className="btn btn-outline btn-small" onClick={() => setQuery("")}>
                ניקוי החיפוש
              </button>
            </div>
          )}
          {sections.map((c) => (
            <section key={c.id} id={c.id} className="menu-cat" aria-labelledby={`${c.id}-title`}>
              <h2 id={`${c.id}-title`} className="cat-title">{c.title}</h2>
              {c.note && !q && <p className="cat-note">{c.note}</p>}
              <ul className="tiles">
                {c.items.map((item) => (
                  <li key={item.id}>
                    <ProductTile item={item} onOpen={setActiveId} onAdd={add} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <ItemDialog key={activeId} item={activeId ? getItem(activeId) : null} onClose={() => setActiveId(null)} />
    </>
  );
}
