import { Section, Grid, Card, CardBody, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface PatientExamDetailFactsProps {
  exam: Exam | null;
}

function statusTone(status: string): 'neutral' | 'primary' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'scheduled':
      return 'primary';
    default:
      return 'neutral';
  }
}

function formatDateTime(value?: string) {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function PatientExamDetailFacts({ exam }: PatientExamDetailFactsProps) {
  if (!exam) {
    return null;
  }

  const room = exam.room;

  return (
    <Section eyebrow="Details" title="Exam details">
      <Grid size="md" cols={2}>
        <Card>
          <CardBody>
            <div className="ds-stack" style={{ gap: 'var(--space-sm, 0.75rem)' }}>
              <div className="ds-cluster">
                <Icon name="package" />
                <span className="ds-label">Body part</span>
              </div>
              <div>{exam.bodyPart}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="ds-stack" style={{ gap: 'var(--space-sm, 0.75rem)' }}>
              <div className="ds-cluster">
                <Icon name="calendar" />
                <span className="ds-label">Scheduled for</span>
              </div>
              <div>{formatDateTime(exam.scheduledAt)}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="ds-stack" style={{ gap: 'var(--space-sm, 0.75rem)' }}>
              <div className="ds-cluster">
                <Icon name="info" />
                <span className="ds-label">Status</span>
              </div>
              <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="ds-stack" style={{ gap: 'var(--space-sm, 0.75rem)' }}>
              <div className="ds-cluster">
                <Icon name="map-pin" />
                <span className="ds-label">Imaging room</span>
              </div>
              {room ? (
                <div className="ds-stack" style={{ gap: '0.25rem' }}>
                  <div>{room.name}</div>
                  <span className="ds-small ds-muted">Room {room.roomNumber}</span>
                  {!room.isActive && (
                    <Badge tone="danger">Room inactive</Badge>
                  )}
                </div>
              ) : (
                <span className="ds-muted">Room not assigned yet</span>
              )}
            </div>
          </CardBody>
        </Card>
      </Grid>
    </Section>
  );
}