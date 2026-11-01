import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, getExamList, getRoomList, getUserList } from '../api';
import type { Exam, Room, User } from '../types';
import { Alert } from '../components/ui';
import StaffExamsHeader from '../components/StaffExamsHeader';
import StaffExamsContent from '../components/StaffExamsContent';
import ScheduleExamForm from '../components/ScheduleExamForm';

export default function StaffExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExamList();
      setExams(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not load exams. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRooms = useCallback(async () => {
    try {
      const data = await getRoomList();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadPatients = useCallback(async () => {
    try {
      const data = await getUserList({ role: 'patient' });
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadExams();
    loadRooms();
    loadPatients();
  }, [loadExams, loadRooms, loadPatients]);

  const handleCreate = async (payload: { patientId: number; roomId: number; bodyPart: string; scheduledAt: string }) => {
    await api.post('/exams/', {
      patientId: payload.patientId,
      roomId: payload.roomId,
      bodyPart: payload.bodyPart,
      scheduledAt: payload.scheduledAt,
    });
    setShowForm(false);
    await loadExams();
  };

  const handleMarkCompleted = async (examId: number) => {
    try {
      await api.patch(`/exams/${examId}/`, { status: 'completed' });
      await loadExams();
    } catch (err) {
      console.error(err);
      setError('Could not update the exam status.');
    }
  };

  const handleCancel = async (examId: number) => {
    try {
      await api.patch(`/exams/${examId}/`, { status: 'cancelled' });
      await loadExams();
    } catch (err) {
      console.error(err);
      setError('Could not cancel the exam.');
    }
  };

  if (user && user.role === 'patient') {
    return (
      <div className="ds-container ds-section">
        <Alert tone="danger">Staff access required to view this page.</Alert>
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <StaffExamsHeader onScheduleClick={() => setShowForm((prev) => !prev)} examCount={exams.length} />
      {error && (
        <div className="ds-container">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}
      {showForm && (
        <div className="ds-container">
          <ScheduleExamForm patients={patients} rooms={rooms} onSubmit={handleCreate} />
        </div>
      )}
      <StaffExamsContent
        exams={exams}
        loading={loading}
        onMarkCompleted={handleMarkCompleted}
        onCancel={handleCancel}
      />
    </div>
  );
}