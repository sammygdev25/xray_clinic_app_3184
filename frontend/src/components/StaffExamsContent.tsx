import { Card, CardBody, EmptyState, SkeletonCards, Badge, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface StaffExamsContentProps {
  exams: Exam[];
  loading: boolean;
  onMarkCompleted: (examId: number) => void;
  onCancel: (examId: number) => void;
}

function statusTone(status: string): 'neutral' | 'success' | 'danger' | 'soft' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'soft';
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function StaffExamsContent({ exams, loading, onMarkCompleted, onCancel }: StaffExamsContentProps) {
  if (loading) {
    return <SkeletonCards count={4} />;
  }

  if (exams.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No exams scheduled"
        text="Schedule an X-ray exam for a patient to see it appear here."
      />
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Body part</th>
                <th>Room</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>
                    {exam.patient ? exam.patient.phone || `Patient #${exam.patientId}` : `Patient #${exam.patientId}`}
                  </td>
                  <td>{exam.bodyPart}</td>
                  <td>{exam.room ? `${exam.room.name} (${exam.room.roomNumber})` : `Room #${exam.roomId}`}</td>
                  <td>{formatDateTime(exam.scheduledAt)}</td>
                  <td>
                    <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
                  </td>
                  <td>
                    <div className="ds-cluster">
                      {exam.status === 'scheduled' && (
                        <>
                          <Button
                            variant="ghost"
                            size="md"
                            onClick={() => onMarkCompleted(exam.id)}
                            title="Mark as completed"
                          >
                            <Icon name="check" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="md"
                            onClick={() => onCancel(exam.id)}
                            title="Cancel exam"
                          >
                            <Icon name="close" size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
