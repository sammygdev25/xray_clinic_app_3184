import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getExamList } from '../api';
import type { Exam } from '../types';
import PatientDashboardHeader from '../components/PatientDashboardHeader';
import PatientDashboardStats from '../components/PatientDashboardStats';
import PatientDashboardRecent from '../components/PatientDashboardRecent';
import PatientDashboardActions from '../components/PatientDashboardActions';
import { Alert } from '../components/ui';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getExamList();
      setExams(data);
    } catch (err) {
      console.error(err);
      setError('Could not load your exams. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const patientName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email
    : '';

  return (
    <div className="ds-stack-lg">
      <PatientDashboardHeader patientName={patientName} />
      {error && <Alert tone="danger">{error}</Alert>}
      <PatientDashboardStats exams={exams} />
      <PatientDashboardRecent exams={exams} loading={loading} />
      <PatientDashboardActions onRefresh={loadExams} />
    </div>
  );
}