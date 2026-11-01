import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeCtaProps {
  isAuthenticated?: boolean;
}

export default function HomeCta({ isAuthenticated }: HomeCtaProps) {
  return (
    <Section tight>
      <div className="ds-card ds-card-body ds-between">
        <p className="ds-lead">
          Book your X-ray exam today or check your results anytime from your patient dashboard.
        </p>
        <Button
          variant="primary"
          size="lg"
          to={isAuthenticated ? '/dashboard' : '/register'}
        >
          {isAuthenticated ? 'Go to dashboard' : 'Create your account'}
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>
    </Section>
  );
}