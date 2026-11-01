import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

export interface PatientDashboardActionsProps {
  onRefresh?: () => void;
}

export default function PatientDashboardActions({ onRefresh }: PatientDashboardActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm">
        <Button variant="primary" to="/">
          <Icon name="calendar" size={16} />
          Browse clinic services
        </Button>
        <Button variant="secondary" to="/profile">
          <Icon name="user" size={16} />
          Update my profile
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Icon name="arrow-left" size={16} />
          Back to top
        </Button>
        {onRefresh && (
          <Button variant="ghost" onClick={onRefresh}>
            <Icon name="refresh" size={16} />
            Refresh exams
          </Button>
        )}
      </Cluster>
    </Section>
  );
}