import { getItem } from "../data/menu";
import { RESTAURANT } from "../data/restaurant";

// choices: { [groupId]: optionId[] }
export function defaultChoices(item) {
  const choices = {};
  for (const g of item.groups) choices[g.id] = g.type === "single" ? [g.options[0].id] : [];
  return choices;
}

export function unitPrice(item, choices) {
  let price = item.price;
  for (const g of item.groups) {
    for (const option of g.options) {
      if (choices[g.id]?.includes(option.id)) price += option.price;
    }
  }
  return price;
}

// Same item with the same choices shares a cart line
export function lineKey(itemId, choices) {
  const parts = Object.keys(choices)
    .sort()
    .filter((k) => choices[k].length)
    .map((k) => `${k}:${[...choices[k]].sort().join(",")}`);
  return [itemId, ...parts].join("|");
}

// Human-readable summary, e.g. ["כפול", "בלי: חסה, עגבנייה", "בצד: פסטו"]
export function describeChoices(item, choices) {
  const out = [];
  for (const g of item.groups) {
    const picked = g.options.filter((o) => choices[g.id]?.includes(o.id));
    if (g.type === "single") {
      // The first option is usually the default ("רגיל") and isn't worth mentioning
      if (picked[0] && (picked[0] !== g.options[0] || g.showDefault)) {
        out.push(g.summary ? `${g.summary}: ${picked[0].label}` : picked[0].label);
      }
    } else if (picked.length) {
      out.push(`${g.summary}: ${picked.map((o) => o.label).join(", ")}`);
    }
  }
  return out;
}

export function resolveLines(lines) {
  return lines
    .map((line) => {
      const item = getItem(line.itemId);
      if (!item) return null;
      const unit = unitPrice(item, line.choices);
      return { ...line, item, unit, total: unit * line.qty, details: describeChoices(item, line.choices) };
    })
    .filter(Boolean);
}

export function totals(resolved, fulfillment = "pickup") {
  const subtotal = resolved.reduce((sum, l) => sum + l.total, 0);
  const delivery = fulfillment === "delivery" ? RESTAURANT.deliveryFee : 0;
  const count = resolved.reduce((sum, l) => sum + l.qty, 0);
  return { subtotal, delivery, total: subtotal + delivery, count };
}
