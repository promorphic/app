import { useSyncExternalStore } from 'react';

// A value any component can read and set, kept outside the component tree.
export function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  const get = () => value;
  const set = (next: T) => {
    if (Object.is(next, value)) return;
    value = next;
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => { listeners.delete(l); };
  };
  const use = () => useSyncExternalStore(subscribe, get);
  return { get, set, subscribe, use };
}
