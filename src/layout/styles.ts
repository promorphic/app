import type { CSSProperties } from 'react';

export const SANS = "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif";
export const MONO = "'Geist Mono','SF Mono',Menlo,Consolas,monospace";

// The small capital label above a group or a heading.
export const eyebrow: CSSProperties = {
  fontFamily: MONO, fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
};
export const visuallyHidden: CSSProperties = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' };
