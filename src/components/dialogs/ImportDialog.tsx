import { STAGE_COUNT } from '../../data/stages';
import type { Progress } from '../../lib/progress';
import { Modal } from '../common/Modal';

type Props = { incoming: Progress; onCancel: () => void; onConfirm: () => void };

export function ImportDialog({ incoming, onCancel, onConfirm }: Props) {
  const tasks = Object.values(incoming.checked).reduce((sum, list) => sum + list.length, 0);
  const notes = Object.keys(incoming.notes).length;
  return (
    <Modal titleId="import-title" onClose={onCancel}>
      <h2 id="import-title">Replace your progress with this file?</h2>
      <p>
        The file contains {incoming.completed.length} of {STAGE_COUNT} stages complete, {tasks} checked tasks, {notes}{' '}
        {notes === 1 ? 'note' : 'notes'} and {incoming.bookmarked.length} {incoming.bookmarked.length === 1 ? 'bookmark' : 'bookmarks'}.
        Importing replaces the progress currently saved in this browser.
      </p>
      <div className="modal-actions">
        <button type="button" className="btn secondary" data-autofocus onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn primary" onClick={onConfirm}>
          Replace my progress
        </button>
      </div>
    </Modal>
  );
}
