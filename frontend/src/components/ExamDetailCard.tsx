import type { Exam } from '../types';
import { Card, CardBody, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface ExamDetailCardProps {
  exam: Exam;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExamDetailCard({ exam }: ExamDetailCardProps) {
  const tone = STATUS_TONE[exam.status] ?? 'neutral';

  return (
    <Card>
      <CardBody>
        <div className="ds-between" style={{ marginBottom: '0.75rem' }}>
          <h2 className="ds-card-title" style={{ margin: 0 }}>
            {exam.bodyPart} X-ray
          </h2>
          <Badge tone={tone}>{exam.status}</Badge>
        </div>

        <div className="ds-stack" style={{ gap: '0.65rem' }}>
          <div className="ds-cluster" style={{ gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
            <Icon name="calendar" size={18} />
            <span>{formatDateTime(exam.scheduledAt)}</span>
          </div>

          {exam.room && (
            <div className="ds-cluster" style={{ gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <Icon name="map-pin" size={18} />
              <span>
                {exam.room.name} (Room {exam.room.roomNumber})
              </span>
            </div>
          )}

          {exam.patient && (
            <div className="ds-cluster" style={{ gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <Icon name="user" size={18} />
              <span>{exam.patient.phone}</span>
            </div>
          )}

          {exam.createdBy && (
            <div className="ds-cluster" style={{ gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <Icon name="users" size={18} />
              <span>Scheduled by {exam.createdBy.phone}</span>
            </div>
          )}

          <div className="ds-cluster" style={{ gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
            <Icon name="clock" size={18} />
            <span className="ds-small">Created {formatDateTime(exam.createdAt)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default ExamDetailCard;
