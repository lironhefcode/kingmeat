import { useEffect } from "react";
import { useCart } from "../cart/CartContext";
import "./Toast.css";

export function Toast() {
  const { toast, dismissToast, openDrawer } = useCart();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 3500);
    return () => clearTimeout(t);
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast-action"
            onClick={() => {
              dismissToast();
              openDrawer();
            }}
          >
            לסל
          </button>
        </div>
      )}
    </div>
  );
}
