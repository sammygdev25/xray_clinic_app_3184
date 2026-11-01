import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Button, Alert } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam, Report } from '../types';

interface ExamReportFormFormProps {
  exam: Exam;
  report: Report | null;
  onSubmit: (data: { findings: string; conclusion: string }) => void | Promise<void>;
  submitting?: boolean;
  error?: string | null;
}

export default function ExamReportFormForm({
  exam,
  report,
  onSubmit,
  submitting = false,
  error = null,
}: ExamReportFormFormProps) {
  const navigate = useNavigate();
  const [findings, setFindings] = useState(report?.findings ?? '');
  const [conclusion, setConclusion] = useState(report?.conclusion ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!findings.trim()) {
      setValidationError('Findings are required before the report can be signed off.');
      return;
    }
    setValidationError(null);
    await onSubmit({ findings: findings.trim(), conclusion: conclusion.trim() });
  };

  return (
    <Section
      narrow
      eyebrow="Radiology report"
      title={`${exam.bodyPart} exam report`}
      subtitle={`Scheduled ${new Date(exam.scheduledAt).toLocaleString()}`}
    >
      {(validationError || error) && <Alert tone="danger">{validationError || error}</Alert>}
      <form className="ds-form" onSubmit={handleSubmit}>
        <div className="ds-field">
          <label className="ds-label" htmlFor="findings">
            Findings
          </label>
          <textarea
            id="findings"
            className="input"
            rows={6}
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            placeholder="Describe what the images show: bone density, alignment, soft tissue, any abnormal shadows or fractures..."
            required
          />
          <p className="ds-help">
            Be specific about location, size and character of any finding so the referring clinician can act on it.
          </p>
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="conclusion">
            Conclusion
          </label>
          <textarea
            id="conclusion"
            className="input"
            rows={4}
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            placeholder="Summarize the impression and any recommended follow-up..."
          />
          <p className="ds-help">
            Optional, but recommended: a short impression helps the patient and clinician understand next steps.
          </p>
        </div>
        <div className="ds-form-actions">
          <Button type="button" variant="ghost" onClick={() => navigate('/staff/exams')}>
            <Icon name="arrow-left" size={16} /> Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            <Icon name="check" size={16} /> {submitting ? 'Saving report...' : report ? 'Update report' : 'Sign and submit report'}
          </Button>
        </div>
      </form>
    </Section>
  );
}