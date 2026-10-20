// Red panel whose lower edge (or upper, with edge="top") is a wave
export function WavePanel({ as: Tag = "section", edge = "bottom", className = "", children, ...rest }) {
  return (
    <Tag className={`wave-panel${edge === "top" ? " edge-top" : ""} ${className}`.trim()} {...rest}>
      {children}
      <svg className="wave-edge" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0h1440v22c-160 30-330 38-520 20S560 6 380 18 130 60 0 42z" />
      </svg>
    </Tag>
  );
}
