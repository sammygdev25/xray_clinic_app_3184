import { useState, FormEvent } from 'react';
import {
  Section,
  Card,
  CardBody,
  Stack,
  Cluster,
  Button,
  Badge,
  EmptyState,
  SkeletonCards,
  Alert,
} from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice, Exam, User } from '../types';

interface StaffInvoicesContentProps {
  invoices: Invoice[];
  patients: User[];
  exams: Exam[];
  loading: boolean;
  error?: string | null;
  onCreateInvoice: (data: { patientId: number; examId: number | null; amount: number }) => Promise<void> | void;
  onMarkPaid: (id: number) => void;
  onCancelInvoice: (id: number) => void;
}

export default function StaffInvoicesContent({
  invoices,
  patients,
  exams,
  loading,
  error,
  onCreateInvoice,
  onMarkPaid,
  onCancelInvoice,
}: StaffInvoicesContentProps) {
  const [patientId, setPatientId] = useState('');
  const [examId, setExamId] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientId || !amount) return;
    setSubmitting(true);
    try {
      await onCreateInvoice({
        patientId: Number(patientId),
        examId: examId ? Number(examId) : null,
        amount: Number(amount),
      });
      setPatientId('');
      setExamId('');
      setAmount('');
    } finally {
      setSubmitting(false);
    }
  };

  const statusTone = (status: string) =>
    status === 'paid' ? 'success' : status === 'cancelled' ? 'danger' : 'soft';

  return (
    <Section title="Billing" eyebrow="Invoices" tight>
      <Stack gap="lg">
        {error && <Alert tone="danger">{error}</Alert>}

        <Card>
          <CardBody>
            <form className="ds-form" onSubmit={handleSubmit}>
              <div className="ds-form-row">
                <div className="ds-field">
                  <label className="ds-label" htmlFor="patient">Patient</label>
                  <select id="patient" className="input" value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>Patient #{p.id} ({p.phone})</option>
                    ))}
                  </select>
                </div>
                <div className="ds-field">
                  <label className="ds-label" htmlFor="exam">Exam (optional)</label>
                  <select id="exam" className="input" value={examId} onChange={(e) => setExamId(e.target.value)}>
                    <option value="">No linked exam</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.bodyPart} - #{ex.id}</option>
                    ))}
                  </select>
                </div>
                <div className="ds-field">
                  <label className="ds-label" htmlFor="amount">Amount (USD)</label>
                  <input id="amount" className="input" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>
              <div className="ds-form-actions">
                <Button type="submit" variant="primary" disabled={submitting}>
                  <Icon name="credit-card" size={16} /> {submitting ? 'Creating...' : 'Create invoice'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {loading ? (
          <SkeletonCards count={3} />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon="credit-card"
            title="No invoices yet"
            text="Charges created for patient exams will appear here."
          />
        ) : (
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Exam</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.patient ? `Patient #${inv.patient.id} (${inv.patient.phone})` : `Patient #${inv.patientId}`}</td>
                    <td>{inv.exam ? `${inv.exam.bodyPart} (#${inv.exam.id})` : '—'}</td>
                    <td>${Number(inv.amount).toFixed(2)}</td>
                    <td><Badge tone={statusTone(inv.status)}>{inv.status}</Badge></td>
                    <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Cluster gap="sm">
                        {inv.status === 'unpaid' && (
                          <>
                            <Button size="md" variant="secondary" onClick={() => onMarkPaid(inv.id)}>
                              <Icon name="check" size={14} /> Mark paid
                            </Button>
                            <Button size="md" variant="danger" onClick={() => onCancelInvoice(inv.id)}>
                              <Icon name="close" size={14} /> Cancel
                            </Button>
                          </>
                        )}
                      </Cluster>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Stack>
    </Section>
  );
}
