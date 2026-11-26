import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import type { Asset } from '../../assets/types';
import { useChains } from '../../assets/useAssets';
import { AssetsScreen } from '../../pages/Assets';
import { testPrice, useTestAssets } from './test';

const NONE: Asset[] = [];

// The Assets screen for the test account: the test instruments on Canton, with Canton already
// chosen in the Chain filter. A row's Actions button leads to the agent, which is how they trade.
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
      variant={{ chain: 'canton', lead: 'Test instruments on Canton. They have no value: they are here so a mandate and a settlement can be tried end to end.', onAction: () => navigate('/agent/') }}
    />
  );
}
