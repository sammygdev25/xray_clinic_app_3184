import { useState, useEffect, useCallback } from 'react';
import { api, getInvoiceList, getUserList, getExamList } from '../api';
import type { Invoice, User, Exam } from '../types';
import StaffInvoicesHeader from '../components/StaffInvoicesHeader';
import StaffInvoicesContent from '../components/StaffInvoicesContent';

export default function StaffInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      const data = await getInvoiceList();
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load invoices.');
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

  const loadExams = useCallback(async () => {
    try {
      const data = await getExamList();
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([loadInvoices(), loadPatients(), loadExams()]).finally(() => setLoading(false));
  }, [loadInvoices, loadPatients, loadExams]);

  const handleCreateInvoice = useCallback(
    async (data: { patientId: number; examId: number | null; amount: number }) => {
      try {
        await api.post('/invoices/', {
          patientId: data.patientId,
          examId: data.examId,
          amount: data.amount,
        });
        await loadInvoices();
      } catch (err) {
        console.error(err);
        setError('Could not create invoice.');
      }
    },
    [loadInvoices]
  );

  const handleMarkPaid = useCallback(
    async (id: number) => {
      try {
        await api.patch(`/invoices/${id}/`, { status: 'paid' });
        await loadInvoices();
      } catch (err) {
        console.error(err);
        setError('Could not update invoice.');
      }
    },
    [loadInvoices]
  );

  const handleCancelInvoice = useCallback(
    async (id: number) => {
      try {
        await api.patch(`/invoices/${id}/`, { status: 'cancelled' });
        await loadInvoices();
      } catch (err) {
        console.error(err);
        setError('Could not cancel invoice.');
      }
    },
    [loadInvoices]
  );

  return (
    <div className="ds-stack-lg">
      <StaffInvoicesHeader invoiceCount={invoices.length} />
      <StaffInvoicesContent
        invoices={invoices}
        patients={patients}
        exams={exams}
        loading={loading}
        error={error}
        onCreateInvoice={handleCreateInvoice}
        onMarkPaid={handleMarkPaid}
        onCancelInvoice={handleCancelInvoice}
      />
    </div>
  );
}