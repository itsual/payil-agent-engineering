import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type Props = {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  /** `wide` gives diagrams room; the default suits short confirmations. */
  size?: 'narrow' | 'wide';
};

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Accessible modal dialog: traps focus, closes on Escape or backdrop click, restores focus on close. */
export function Modal({ titleId, onClose, children, size = 'narrow' }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const target = node.querySelector<HTMLElement>('[data-autofocus]') ?? node.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div ref={panel} className={`modal ${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
