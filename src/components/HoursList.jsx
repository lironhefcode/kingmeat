import "./HoursList.css";

export function HoursList({ hours, className = "" }) {
  return (
    <dl className={`hours ${className}`.trim()}>
      {hours.map((h) => (
        <div key={h.days}>
          <dt>{h.days}</dt>
          <dd dir="ltr">{h.hours}</dd>
        </div>
      ))}
    </dl>
  );
}
