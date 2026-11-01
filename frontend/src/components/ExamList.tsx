import type { Exam } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState, Stack } from './ui';
import { Icon } from './icons';

interface ExamListProps {
  exams: Exam[];
  onSelect: (exam: Exam) => void;
  showPatient: boolean;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'scheduled':
    default:
      return 'primary';
  }
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExamList({ exams, onSelect, showPatient }: ExamListProps) {
  if (!exams || exams.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No exams found"
        text="There are no X-ray exams to show right now."
      />
    );
  }

  return (
    <Stack gap="sm">
      {exams.map((exam) => (
        <Card key={exam.id} onClick={() => onSelect(exam)} className="ds-exam-list-card">
          <CardBody>
            <div className="ds-between">
              <CardTitle>{exam.bodyPart}</CardTitle>
              <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
            </div>
            <CardMeta>
              <span className="ds-cluster">
                <Icon name="calendar" size={16} />
                {formatDateTime(exam.scheduledAt)}
              </span>
            </CardMeta>
            <CardMeta>
              <span className="ds-cluster">
                <Icon name="map-pin" size={16} />
                {exam.room?.name ?? `Room #${exam.roomId}`}
              </span>
            </CardMeta>
            {showPatient && (
              <CardMeta>
                <span className="ds-cluster">
                  <Icon name="user" size={16} />
                  {exam.patient?.phone ?? `Patient #${exam.patientId}`}
                </span>
              </CardMeta>
            )}
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}

export default ExamList;
