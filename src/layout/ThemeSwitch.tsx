import { toggleTheme, useTheme } from '../lib/theme';

// Off for the light version, on for the dark one.
export function ThemeSwitch() {
  const dark = useTheme() === 'dark';
  return (
    <button className="theme-switch" type="button" role="switch" aria-checked={dark} aria-label="Dark version" onClick={toggleTheme}>
      <span className="theme-switch-knob" aria-hidden="true">
        <svg className="icon-sun" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="2.75" />
          <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.05 1.05M11.55 11.55l1.05 1.05M3.4 12.6l1.05-1.05M11.55 4.45l1.05-1.05" />
        </svg>
        <svg className="icon-moon" viewBox="0 0 16 16">
          <path d="M13.25 9.6A5.6 5.6 0 0 1 6.4 2.75a5.6 5.6 0 1 0 6.85 6.85z" />
        </svg>
      </span>
    </button>
  );
}
