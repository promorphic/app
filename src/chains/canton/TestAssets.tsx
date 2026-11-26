import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import type { Asset } from '../../assets/types';
import { useChains } from '../../assets/useAssets';
import { toast } from '../../lib/toast';
import { AssetsScreen } from '../../pages/Assets';
import { testPrice, useTestAssets } from './test';

const NONE: Asset[] = [];

// The Assets screen for the sandbox account: test instruments on every chain the app lists, with
// Canton already chosen in the Chain filter, because that is where the sandbox settles. A Canton
// row's Actions button leads to the agent, which is how they trade; the others are listings only.
export default function TestAssets() {
  const q = useTestAssets();
  const navigate = useNavigate();
  const cash = q.data?.cash ?? 'CC-TEST';
  const price = useCallback((a: Asset) => testPrice(a, cash), [cash]);
  // the API names the chain; the app's own list adds its short code and logo
  const known = useChains();
  const chains = useMemo(() => ({ ...q.data?.chains, ...known }), [q.data?.chains, known]);
  return (
    <AssetsScreen
      source={{ loading: q.isPending, failed: q.isError, chains, featured: {}, assets: q.data?.assets ?? NONE, price }}
      variant={{
        chain: 'canton',
        lead: 'Test instruments across the chains Promorphic lists. They have no value. Sandbox trades settle on Canton, so the list opens on Canton.',
        onAction: (a) => (a.chains.includes('canton') ? navigate('/agent/') : toast(`${a.ticker} is a listing only. Sandbox trades settle on Canton.`)),
      }}
    />
  );
}
