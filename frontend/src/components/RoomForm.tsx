import { useState, FormEvent } from 'react';
import { Button } from './ui';
import type { Room } from '../types';

interface RoomFormProps {
  room?: Room | null;
  onSubmit: (data: { name: string; room_number: string; is_active: boolean }) => void | Promise<void>;
  onCancel: () => void;
}

function RoomForm({ room, onSubmit, onCancel }: RoomFormProps) {
  const [name, setName] = useState(room?.name ?? '');
  const [roomNumber, setRoomNumber] = useState(room?.roomNumber ?? '');
  const [isActive, setIsActive] = useState(room?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !roomNumber.trim()) {
      setError('Room name and room number are required.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), room_number: roomNumber.trim(), is_active: isActive });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this room.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert">
          {error}
        </div>
      )}

      <div className="ds-field">
        <label className="ds-label" htmlFor="room-name">
          Room name
        </label>
        <input
          id="room-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. X-Ray Suite 1"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="room-number">
          Room number
        </label>
        <input
          id="room-number"
          className="input"
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="e.g. R-104"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label ds-cluster" style={{ alignItems: 'center' }} htmlFor="room-active">
          <input
            id="room-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Room is active and available for scheduling
        </label>
        <p className="ds-help">Inactive rooms stay on record but cannot be booked for new exams.</p>
      </div>

      <div className="ds-form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : room ? 'Save changes' : 'Add room'}
        </Button>
      </div>
    </form>
  );
}

export default RoomForm;
export { RoomForm };