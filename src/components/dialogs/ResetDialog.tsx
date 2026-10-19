import { Modal } from '../common/Modal';

type Props = { onCancel: () => void; onConfirm: () => void };

export function ResetDialog({ onCancel, onConfirm }: Props) {
  return (
    <Modal titleId="reset-title" onClose={onCancel}>
      <h2 id="reset-title">Reset your progress?</h2>
      <p>
        This clears completed stages, checked tasks, quiz results, bookmarks and notes stored in this browser. It cannot be undone, so
        export your progress first if you want a copy.
      </p>
      <div className="modal-actions">
        <button type="button" className="btn secondary" data-autofocus onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn danger" onClick={onConfirm}>
          Clear progress
        </button>
      </div>
    </Modal>
  );
}
