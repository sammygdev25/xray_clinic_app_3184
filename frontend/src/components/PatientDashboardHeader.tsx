import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientDashboardHeaderProps {
  patientName: string;
  onScheduleExam?: () => void;
}

export default function PatientDashboardHeader({ patientName, onScheduleExam }: PatientDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Patient dashboard"
      title={`Welcome back, ${patientName}`}
      subtitle="Track your upcoming X-ray exams, review past results and keep an eye on your invoices, all in one place."
      actions={
        onScheduleExam ? (
          <Button variant="primary" size="lg" onClick={onScheduleExam}>
            <Icon name="calendar" size={18} />
            Request an exam
          </Button>
        ) : undefined
      }
    />
  );
}