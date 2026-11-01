import { Section, Split, Media, CardMeta, Badge, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface PatientExamDetailMediaProps {
  exam: Exam;
}

function statusTone(status: string): 'neutral' | 'success' | 'danger' | 'soft' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'soft';
}

function formatDate(value: string) {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PatientExamDetailMedia({ exam }: PatientExamDetailMediaProps) {
  return (
    <Section eyebrow="Exam record" title={exam.bodyPart} tight>
      <Split>
        <Media
          ratio="wide"
          alt={`X-ray of ${exam.bodyPart}`}
          badge={exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
        />
        <div className="ds-stack">
          <span className="ds-eyebrow">Radiology exam</span>
          <h1 className="ds-card-title">{exam.bodyPart} X-ray</h1>
          <CardMeta>
            <Icon name="calendar" size={16} />
            {formatDate(exam.scheduledAt)}
          </CardMeta>
          {exam.room && (
            <CardMeta>
              <Icon name="map-pin" size={16} />
              Room {exam.room.roomNumber} &middot; {exam.room.name}
            </CardMeta>
          )}
          <Badge tone={statusTone(exam.status)}>
            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
          </Badge>
          <div className="ds-form-actions">
            <Button to="/dashboard" variant="primary">
              <Icon name="arrow-left" size={16} />
              Back to dashboard
            </Button>
          </div>
        </div>
      </Split>
    </Section>
  );
}