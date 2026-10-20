import { useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

// index.html applies the saved theme before first paint; this only switches it
export function ThemeToggle() {
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === "light");

  const toggle = () => {
    const theme = light ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#FFFFFF" : "#000000");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Private mode: the choice just won't be remembered
    }
    setLight(!light);
  };

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={light ? "מעבר למצב כהה" : "מעבר למצב בהיר"}>
      {light ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
