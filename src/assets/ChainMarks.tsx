import { useState } from 'react';
import { chainCode, chainName, type Chains } from './filters';

// A chain is shown by its mark, in the variant for the current theme; without one, by its short code.
function ChainMark({ id, chains }: { id: string; chains: Chains }) {
  const [broken, setBroken] = useState(false);
  const logo = chains[id]?.logo, name = chainName(chains, id);
  if (!logo || broken) return <span className="chain" title={name}>{chainCode(chains, id)}</span>;
  return (
    <span className="chain" title={name}>
      <img className="on-dark" src={`/static/chains/${logo}-on-dark.svg`} width={20} height={20} alt={name} onError={() => setBroken(true)} />
      <img className="on-light" src={`/static/chains/${logo}-on-light.svg`} width={20} height={20} alt="" onError={() => setBroken(true)} />
    </span>
  );
}

export function ChainMarks({ ids, chains }: { ids: string[]; chains: Chains }) {
  return <span className="chains">{ids.map((id) => <ChainMark key={id} id={id} chains={chains} />)}</span>;
}
