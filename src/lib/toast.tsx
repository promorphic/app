import { createStore } from './store';

// The status line at the foot of the screen, for actions that have nothing behind them yet.
const store = createStore<string | null>(null);
let timer: ReturnType<typeof setTimeout>;

export function toast(message: string) {
  store.set(message);
  clearTimeout(timer);
  timer = setTimeout(() => store.set(null), 2600);
}
export const notYet = () => toast('Not available in the sandbox yet.');

export function Toast() {
  const message = store.use();
  return <div className="toast" role="status" hidden={!message}>{message}</div>;
}
