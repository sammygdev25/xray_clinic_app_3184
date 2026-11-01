import { Link } from 'react-router-dom';
import { Section, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface PatientDashboardRecentProps {
  exams: Exam[];
  loading?: boolean;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
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

export default function PatientDashboardRecent({ exams, loading }: PatientDashboardRecentProps) {
  const recent = [...exams]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <Section eyebrow="Recent activity" title="Your latest exams" tight>
      {loading ? (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <tbody>
              <tr>
                <td>Loading recent exams…</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : recent.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No exams yet"
          text="Once an exam is scheduled for you at the clinic, it will show up here."
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Body part</th>
                <th>Scheduled</th>
                <th>Room</th>
                <th>Status</th>
                <th aria-label="View" />
              </tr>
            </thead>
            <tbody>
              {recent.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.bodyPart}</td>
                  <td>{new Date(exam.scheduledAt).toLocaleString()}</td>
                  <td>{exam.room?.name ?? '—'}</td>
                  <td>
                    <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
                  </td>
                  <td>
                    <Link to={`/exams/${exam.id}`} className="ds-cluster">
                      <Icon name="arrow-right" size={16} title="View exam" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}