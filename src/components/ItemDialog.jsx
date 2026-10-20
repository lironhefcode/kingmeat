import { useState } from "react";
import { useCart } from "../cart/CartContext";
import { defaultChoices, unitPrice } from "../cart/pricing";
import { ORDER_NOTE } from "../data/menu";
import { CloseIcon } from "./Icons";
import { Modal } from "./Modal";
import { Price, priceText } from "./Price";
import { QtyStepper } from "./QtyStepper";
import "./ItemDialog.css";

// Render with key={item.id} so choices reset when a different item opens
export function ItemDialog({ item, onClose }) {
  const { add } = useCart();
  const [choices, setChoices] = useState(() => (item ? defaultChoices(item) : {}));
  const [qty, setQty] = useState(1);

  if (!item) return <Modal open={false} onClose={onClose} />;

  const toggle = (group, optionId) => {
    setChoices((prev) => {
      const current = prev[group.id] ?? [];
      if (group.type === "single") return { ...prev, [group.id]: [optionId] };
      const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [group.id]: next };
    });
  };

  const total = unitPrice(item, choices) * qty;

  return (
    <Modal open onClose={onClose} className="item-dialog" labelledBy="item-title">
      <form
        className="item-inner"
        onSubmit={(e) => {
          e.preventDefault();
          add(item.id, choices, qty);
          onClose();
        }}
      >
        <div className="item-scroll">
          <div className="item-media">
            <img src={item.image} alt="" width="900" height="600" />
            <button type="button" className="icon-btn item-close" onClick={onClose} aria-label="סגירה">
              <CloseIcon />
            </button>
          </div>

          <div className="item-head">
            <div>
              {item.badge && <span className="badge item-badge">{item.badge}</span>}
              <h2 id="item-title" className="item-name">{item.name}</h2>
              {item.sub && <p className="item-sub">{item.sub}</p>}
            </div>
            <Price value={item.price} className="item-price" />
          </div>
          {item.desc && <p className="item-desc">{item.desc}</p>}
          {item.groups.length > 0 && <p className="item-note">{ORDER_NOTE}</p>}

          {item.groups.map((group) => {
            const selected = choices[group.id] ?? [];
            const full = group.max != null && selected.length >= group.max;
            return (
              <fieldset key={group.id} className="item-group">
                <legend className="item-group-title">
                  {group.title}
                  {group.hint && <span className="item-group-hint">{group.hint}</span>}
                </legend>
                <div className={`item-options${group.options.length > 4 ? " is-grid" : ""}`}>
                  {group.options.map((option) => {
                    const checked = selected.includes(option.id);
                    return (
                      <label key={option.id} className="choice">
                        <input
                          type={group.type === "single" ? "radio" : "checkbox"}
                          name={`${item.id}-${group.id}`}
                          checked={checked}
                          disabled={!checked && full}
                          onChange={() => toggle(group, option.id)}
                        />
                        <span className="choice-label">{option.label}</span>
                        {option.price > 0 && <span className="choice-price">+{priceText(option.price)}</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <div className="item-foot">
          <QtyStepper value={qty} onChange={setQty} label={item.name} />
          <button type="submit" className="btn btn-red item-add">
            <span>הוספה לסל</span>
            <Price value={total} plain />
          </button>
        </div>
      </form>
    </Modal>
  );
}
