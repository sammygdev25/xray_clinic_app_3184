import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffInvoicesHeaderProps {
  invoiceCount?: number;
  onNewInvoice?: () => void;
}

export default function StaffInvoicesHeader({ invoiceCount, onNewInvoice }: StaffInvoicesHeaderProps) {
  return (
    <PageHeader
      eyebrow="Billing"
      title="Patient Invoices"
      subtitle={
        typeof invoiceCount === 'number'
          ? `${invoiceCount} invoice${invoiceCount === 1 ? '' : 's'} on record for completed and scheduled X-ray exams`
          : 'Create and manage invoices for patient X-ray exams'
      }
      actions={
        onNewInvoice ? (
          <Button variant="primary" onClick={onNewInvoice}>
            <Icon name="plus" size={16} />
            New Invoice
          </Button>
        ) : undefined
      }
    />
  );
}