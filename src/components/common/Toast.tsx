import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export type Notice = { id: number; tone: 'success' | 'error'; text: string };

/** Short-lived status message. Announced politely to screen readers. */
export function Toast({ notice, onDismiss }: { notice: Notice | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {notice && (
        <div className={`toast ${notice.tone}`} key={notice.id}>
          {notice.tone === 'success' ? <CheckCircle2 size={17} aria-hidden="true" /> : <AlertTriangle size={17} aria-hidden="true" />}
          <span>{notice.text}</span>
        </div>
      )}
    </div>
  );
}
