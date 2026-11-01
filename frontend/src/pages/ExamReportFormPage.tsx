import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getExam, getReportList, createReport } from '../api';
import type { Exam, Report } from '../types';
import ExamReportFormHeader from '../components/ExamReportFormHeader';
import ExamReportFormForm from '../components/ExamReportFormForm';
import ExamReportFormInfo from '../components/ExamReportFormInfo';
import { LoadingBlock, Alert } from '../components/ui';

export default function ExamReportFormPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const loadExam = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getExam(Number(id));
      setExam(data);
    } catch (err) {
      console.error(err);
      setLoadError('Unable to load this exam. It may have been removed.');
    }
  }, [id]);

  const loadReport = useCallback(async () => {
    if (!id) return;
    try {
      const reports = await getReportList();
      const existing = reports.find((r) => r.examId === Number(id));
      setReport(existing ?? null);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([loadExam(), loadReport()]).finally(() => setLoading(false));
  }, [loadExam, loadReport]);

  const handleSubmit = async (data: { findings: string; conclusion: string }) => {
    if (!exam) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const now = new Date().toISOString();
      const created = await createReport({
        examId: exam.id,
        radiologistId: user?.id ?? null,
        createdAt: now,
        updatedAt: now,
        ...data,
      });
      setReport(created);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError('Could not save this report. Check the fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingBlock label="Loading exam..." />;
  }

  if (loadError || !exam) {
    return (
      <div className="ds-container ds-section">
        <Alert tone="danger">{loadError ?? 'Exam not found.'}</Alert>
      </div>
    );
  }

  const canWrite = user?.role === 'radiologist';

  return (
    <div className="ds-stack-lg">
      <ExamReportFormHeader exam={exam} isEdit={!!report} />

      {!canWrite && (
        <div className="ds-container">
          <Alert tone="neutral">Only radiologists can write or edit a report for this exam.</Alert>
        </div>
      )}

      {submitted && report ? (
        <div className="ds-container">
          <Alert tone="success">
            Report saved for this exam. <Link to="/staff/exams">Back to exams</Link>
          </Alert>
        </div>
      ) : (
        canWrite && (
          <ExamReportFormForm
            exam={exam}
            report={report}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={submitError}
          />
        )
      )}

      <ExamReportFormInfo />
    </div>
  );
}
