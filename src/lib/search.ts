import { createStore } from './store';

// The header's search box. It filters the Assets list, and leads there from every other screen.
const store = createStore(new URLSearchParams(location.search).get('q') ?? '');
export const useSearch = store.use;
export const setSearch = store.set;
