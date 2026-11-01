import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExam, getRoomList, getReportList } from '../api';
import type { Exam, Room, Report } from '../types';
import { LoadingBlock, Alert, EmptyState } from '../components/ui';
import PatientExamDetailMedia from '../components/PatientExamDetailMedia';
import PatientExamDetailFacts from '../components/PatientExamDetailFacts';
import PatientExamDetailRelated from '../components/PatientExamDetailRelated';
import { ReportView } from '../components/ReportView';

export default function PatientExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const examId = Number(id);
        const examData = await getExam(examId);
        if (!cancelled) setExam(examData);
      } catch (err) {
        if (!cancelled) setError('This exam could not be found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    getRoomList()
      .then((data) => setRooms(data))
      .catch(() => setRooms([]));
  }, []);

  useEffect(() => {
    if (!exam) return;
    getReportList()
      .then((data) => {
        const found = data.find((r) => r.examId === exam.id);
        setReport(found ?? null);
      })
      .catch(() => setReport(null));
  }, [exam]);

  if (loading) {
    return <LoadingBlock label="Loading exam details..." />;
  }

  if (error || !exam) {
    return (
      <EmptyState
        icon="alert"
        title="Exam not found"
        text={error ?? 'We could not locate this exam. It may have been removed.'}
      />
    );
  }

  const relatedRooms = rooms.filter((r) => r.id !== exam.room?.id && r.isActive !== false).slice(0, 6);

  return (
    <div className="ds-stack-lg">
      <PatientExamDetailMedia exam={exam} />
      <PatientExamDetailFacts exam={exam} />
      {report ? (
        <ReportView report={report} />
      ) : (
        <Alert tone="neutral">The radiology report for this exam is not available yet.</Alert>
      )}
      {relatedRooms.length > 0 && (
        <PatientExamDetailRelated rooms={relatedRooms} currentRoomId={exam.room?.id} />
      )}
    </div>
  );
}
