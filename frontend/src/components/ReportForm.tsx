import { useState, FormEvent } from 'react';
import { api } from '../api';
import type { Exam, Report } from '../types';
import { Button, Alert } from './ui';

interface ReportFormProps {
  exam: Exam;
  report?: Report | null;
  onSubmit: (report: Report) => void;
}

export function ReportForm({ exam, report, onSubmit }: ReportFormProps) {
  const [findings, setFindings] = useState(report?.findings ?? '');
  const [conclusion, setConclusion] = useState(report?.conclusion ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!findings.trim()) {
      setError('Findings are required before the report can be saved.');
      return;
    }

    setSubmitting(true);
    try {
      let saved: Report;
      if (report?.id) {
        saved = await api.put(`/reports/${report.id}`, {
          findings: findings.trim(),
          conclusion: conclusion.trim(),
        });
      } else {
        saved = await api.post('/reports/', {
          examId: exam.id,
          findings: findings.trim(),
          conclusion: conclusion.trim(),
        });
      }
      onSubmit(saved);
    } catch (err: any) {
      setError(err?.message || 'Could not save the report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="ds-field">
        <label className="ds-label" htmlFor="findings">
          Findings
        </label>
        <textarea
          id="findings"
          className="input"
          rows={8}
          placeholder={`Describe the radiographic findings for the ${exam.bodyPart} exam...`}
          value={findings}
          onChange={(e) => setFindings(e.target.value)}
          required
        />
        <p className="ds-help">
          Note positioning, exposure quality, and any abnormal densities, fractures, or opacities observed.
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
          placeholder="Summarize the diagnostic impression and any recommended follow-up..."
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
        />
        <p className="ds-help">Optional, but recommended when a clinical recommendation applies.</p>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? 'Saving report...' : report?.id ? 'Update report' : 'Submit report'}
        </Button>
      </div>
    </form>
  );
}

export default ReportForm;