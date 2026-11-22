import { useEffect, useRef, type ReactNode } from 'react';

// A modal dialog. The browser's own <dialog> gives the backdrop, the focus trap and Escape to close.
export function Dialog({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return <dialog ref={ref} className="live-dialog" onClose={onClose}>{children}</dialog>;
}
