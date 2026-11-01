import type { Invoice } from '../types';
import { Badge, Price, EmptyState } from './ui';
import { Icon } from './icons';

interface InvoiceListProps {
  invoices: Invoice[];
}

function statusTone(status: string): 'success' | 'danger' | 'neutral' {
  if (status === 'paid') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <EmptyState
        icon="credit-card"
        title="No invoices yet"
        text="Invoices created for patients will appear here."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Exam</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.patient?.phone ?? `Patient #${invoice.patientId}`}</td>
              <td>
                {invoice.exam
                  ? `${invoice.exam.bodyPart} — ${formatDate(invoice.exam.scheduledAt)}`
                  : <span className="ds-muted">No linked exam</span>}
              </td>
              <td><Price value={Number(invoice.amount)} /></td>
              <td>
                <Badge tone={statusTone(invoice.status)}>
                  <Icon name="credit-card" size={14} /> {invoice.status}
                </Badge>
              </td>
              <td>{formatDate(invoice.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
