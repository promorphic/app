import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SANS } from '../layout/styles';
import type { Filter, Option } from './filters';

const Caret = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: 'var(--ink)' }} strokeWidth="1.5" fill="none" />
  </svg>
);

// One filter: a button that says what is chosen, and the list of choices that drops from it.
export function FilterMenu({ filter, options, selected, label, onToggle }: {
  filter: Filter;
  options: Option[];
  selected: string[];
  label: (value: string) => string;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', away);
    return () => document.removeEventListener('click', away);
  }, [open]);

  // The list opens with its first choice in focus, and is pulled back in if it would run off the right edge.
  useLayoutEffect(() => {
    const el = menu.current;
    if (!open || !el) return;
    const over = el.getBoundingClientRect().right - (window.innerWidth - 16);
    if (over > 0) el.style.left = -over + 'px';
    el.querySelector<HTMLElement>('[role="option"]')?.focus();
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); button.current?.focus(); return; }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = [...(menu.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
  };

  const text = !selected.length ? filter.name
    : filter.name + ': ' + (selected.length === 1 ? label(selected[0]) : selected.length + ' selected');

  return (
    <span className="filter" ref={wrap} onKeyDown={onKeyDown}>
      <button ref={button} className="btn btn-filter" type="button" aria-haspopup="listbox" aria-expanded={open}
        data-active={selected.length ? '' : undefined} onClick={() => setOpen(!open)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '44px', padding: '0 14px', background: 'var(--surface-1)', color: 'var(--ink)', border: '1px solid var(--hairline)', borderRadius: '2px', fontFamily: SANS, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
        {text}
        <Caret />
      </button>
      {open && (
        <div ref={menu} className="menu" role="listbox" aria-label={filter.name} aria-multiselectable={filter.single ? undefined : true}>
          {!options.length && <div style={{ padding: '12px 10px', fontSize: '14px', color: 'var(--ink-muted)' }}>Nothing to filter by yet.</div>}
          {options.map((o) => (
            <button key={o.value} type="button" role="option" className={filter.single ? 'radio' : undefined} aria-selected={selected.includes(o.value)} onClick={() => onToggle(o.value)}>
              <span className="box" aria-hidden="true">
                <svg viewBox="0 0 10 10" fill="none" strokeWidth="1.5"><path d="M2 5.2l2 2 4-4.4" /></svg>
              </span>
              {o.label}
              {o.meta && <span className="meta">{o.meta}</span>}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
