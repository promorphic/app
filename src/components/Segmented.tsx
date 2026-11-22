import type { CSSProperties } from 'react';
import { SANS } from '../layout/styles';

const base: CSSProperties = { fontFamily: SANS, fontSize: '14px', fontWeight: 500, minHeight: '44px', padding: '0 16px', border: 0, cursor: 'pointer' };
const on: CSSProperties = { ...base, background: 'var(--ink)', color: 'var(--surface-0)' };
const off: CSSProperties = { ...base, background: 'transparent', color: 'var(--ink)' };

// A row of buttons where exactly one is pressed.
export function Segmented<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: readonly (T | { value: T; label: string })[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} style={{ display: 'inline-flex', border: '1px solid var(--hairline)', borderRadius: '2px', overflow: 'hidden' }}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const pressed = opt.value === value;
        return (
          <button key={opt.value} className="seg" type="button" aria-pressed={pressed} style={pressed ? on : off} onClick={() => onChange(opt.value)}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
