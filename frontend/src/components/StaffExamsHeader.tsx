import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffExamsHeaderProps {
  onScheduleClick?: () => void;
  examCount?: number;
}

export default function StaffExamsHeader({ onScheduleClick, examCount }: StaffExamsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Front Desk"
      title="Exam Schedule"
      subtitle={
        typeof examCount === 'number'
          ? `${examCount} exam${examCount === 1 ? '' : 's'} on the books across every room and radiologist.`
          : 'Schedule new X-ray exams and keep track of every patient visit across every room and radiologist.'
      }
      actions={
        onScheduleClick ? (
          <Button variant="primary" onClick={onScheduleClick}>
            <Icon name="plus" size={18} />
            Schedule Exam
          </Button>
        ) : undefined
      }
    />
  );
}