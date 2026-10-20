// "₪46" with a small raised shekel sign; `plain` keeps it inline-sized for running text
export function Price({ value, plain = false, className = "" }) {
  return (
    <span className={`${plain ? "price-plain " : ""}${className}`.trim() || undefined}>
      <span className="cur">₪</span>
      {value}
    </span>
  );
}

// For aria-labels and button text
export const priceText = (value) => `${value} ₪`;
