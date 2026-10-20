import { MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import "./QtyStepper.css";

// With `removable`, the minus button turns into a remove button at 1
export function QtyStepper({ value, onChange, label, removable = false, min = 1 }) {
  const atMin = value <= min;
  const showRemove = removable && atMin;
  return (
    <div className="qty" role="group" aria-label={`כמות: ${label}`}>
      <button
        type="button"
        className="qty-btn"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !removable}
        aria-label={showRemove ? `הסרת ${label}` : `הפחתת כמות`}
      >
        {showRemove ? <TrashIcon /> : <MinusIcon />}
      </button>
      <span className="qty-value" aria-live="polite">{value}</span>
      <button type="button" className="qty-btn" onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="הוספת כמות">
        <PlusIcon />
      </button>
    </div>
  );
}
