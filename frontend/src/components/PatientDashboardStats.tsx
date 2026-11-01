import { Grid, Stat } from '../components/ui';
import type { Exam } from '../types';

interface PatientDashboardStatsProps {
  exams: Exam[];
}

export default function PatientDashboardStats({ exams }: PatientDashboardStatsProps) {
  const total = exams.length;
  const upcoming = exams.filter((e) => e.status === 'scheduled').length;
  const completed = exams.filter((e) => e.status === 'completed').length;
  const cancelled = exams.filter((e) => e.status === 'cancelled').length;

  return (
    <div className="ds-section">
      <Grid size="sm" cols={4}>
        <Stat value={total} label="Total exams" icon="package" />
        <Stat value={upcoming} label="Upcoming" icon="calendar" />
        <Stat value={completed} label="Completed" icon="check" />
        <Stat value={cancelled} label="Cancelled" icon="alert" />
      </Grid>
    </div>
  );
}