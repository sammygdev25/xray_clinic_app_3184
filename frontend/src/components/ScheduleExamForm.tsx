import { useState, FormEvent } from 'react';
import { api } from '../api';
import { Button } from '../components/ui';
import type { User, Room, Exam } from '../types';

interface ScheduleExamFormProps {
  patients: User[];
  rooms: Room[];
  onSubmit: (exam: Exam) => void;
}

function ScheduleExamForm({ patients, rooms, onSubmit }: ScheduleExamFormProps) {
  const [patientId, setPatientId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const activeRooms = rooms.filter((r) => r.isActive);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientId || !roomId || !bodyPart.trim() || !scheduledAt) {
      setError('Fill in every field to schedule the exam.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/exams/', {
        patientId: Number(patientId),
        roomId: Number(roomId),
        bodyPart: bodyPart.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      onSubmit(res.data);
      setPatientId('');
      setRoomId('');
      setBodyPart('');
      setScheduledAt('');
    } catch (err: any) {
      setError(err?.message || 'Could not schedule the exam. Please try again.');
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

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="patient">Patient</label>
          <select
            id="patient"
            className="input"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Select a patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                Patient #{p.id} ({p.phone})
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="room">X-ray room</label>
          <select
            id="room"
            className="input"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          >
            <option value="">Select a room</option>
            {activeRooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.roomNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="bodyPart">Body part</label>
          <input
            id="bodyPart"
            className="input"
            type="text"
            placeholder="e.g. Chest, Left wrist, Lumbar spine"
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="scheduledAt">Date and time</label>
          <input
            id="scheduledAt"
            className="input"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Scheduling...' : 'Schedule exam'}
        </Button>
      </div>
    </form>
  );
}

export default ScheduleExamForm;
export { ScheduleExamForm };
