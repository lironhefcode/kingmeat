import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { lineKey, resolveLines, totals } from "./pricing";
import { getItem } from "../data/menu";

const STORAGE_KEY = "kingmeat-cart-v2";
const CartContext = createContext(null);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function reducer(lines, action) {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.itemId, action.choices);
      const existing = lines.find((l) => l.key === key);
      if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + action.qty } : l));
      return [...lines, { key, itemId: action.itemId, choices: action.choices, qty: action.qty }];
    }
    case "setQty":
      if (action.qty <= 0) return lines.filter((l) => l.key !== action.key);
      return lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(action.qty, 99) } : l));
    case "remove":
      return lines.filter((l) => l.key !== action.key);
    case "clear":
      return [];
    default:
      return lines;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage can be unavailable (private mode); the cart still works for this visit
    }
  }, [lines]);

  const add = useCallback((itemId, choices = {}, qty = 1) => {
    dispatch({ type: "add", itemId, choices, qty });
    setToast({ id: Date.now(), message: `נוסף לסל: ${getItem(itemId)?.name ?? ""}` });
  }, []);

  const value = useMemo(() => {
    const resolved = resolveLines(lines);
    return {
      lines: resolved,
      ...totals(resolved),
      add,
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => {
        setToast(null);
        setDrawerOpen(true);
      },
      closeDrawer: () => setDrawerOpen(false),
      toast,
      dismissToast: () => setToast(null),
    };
  }, [lines, add, drawerOpen, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
