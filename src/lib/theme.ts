import { createStore } from './store';

export type Theme = 'light' | 'dark';

// index.html sets the theme before first paint: the saved choice, else the system setting.
const root = document.documentElement;
const store = createStore<Theme>(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

function paint(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0c0e' : '#f7f5f0');
}
paint(store.get());

export const useTheme = store.use;

export function toggleTheme() {
  const next: Theme = store.get() === 'light' ? 'dark' : 'light';
  root.classList.add('theme-change'); // colours change together, without a cross-fade
  root.setAttribute('data-theme', next);
  setTimeout(() => root.classList.remove('theme-change'), 60);
  try { localStorage.setItem('pm-theme', next); } catch { /* private window */ }
  paint(next);
  store.set(next);
}
