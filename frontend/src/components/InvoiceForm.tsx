import { useState, FormEvent } from 'react';
import { Button } from '../components/ui';
import type { User, Exam } from '../types';

interface InvoiceFormProps {
  patients: User[];
  exams: Exam[];
  onSubmit: (data: { patientId: number; examId: number | null; amount: number }) => Promise<void> | void;
}

function InvoiceForm({ patients, exams, onSubmit }: InvoiceFormProps) {
  const [patientId, setPatientId] = useState<string>('');
  const [examId, setExamId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredExams = patientId
    ? exams.filter((e) => String(e.patientId) === patientId)
    : exams;

  const resetForm = () => {
    setPatientId('');
    setExamId('');
    setAmount('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!patientId) {
      setError('Select a patient for this invoice.');
      return;
    }
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a valid amount greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        patientId: Number(patientId),
        examId: examId ? Number(examId) : null,
        amount: parsedAmount,
      });
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Could not create the invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert" style={{ borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="invoice-patient">
            Patient
          </label>
          <select
            id="invoice-patient"
            className="input"
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              setExamId('');
            }}
            required
          >
            <option value="">Select a patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.phone}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="invoice-exam">
            Exam (optional)
          </label>
          <select
            id="invoice-exam"
            className="input"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
          >
            <option value="">No linked exam</option>
            {filteredExams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.bodyPart} X-ray — {new Date(ex.scheduledAt).toLocaleDateString()}
              </option>
            ))}
          </select>
          <p className="ds-help">Link the invoice to the exam it covers, if applicable.</p>
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="invoice-amount">
          Amount (USD)
        </label>
        <input
          id="invoice-amount"
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 150.00"
          required
        />
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create invoice'}
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;
