import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import './styles/app.css';
import './chains/robinhood/live.css';

// Live figures are refetched on their own timers, only while the tab is in view, and again when it
// comes back into view. What was last read stays on screen while moving between screens.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, gcTime: 30 * 60_000, refetchOnWindowFocus: true } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
