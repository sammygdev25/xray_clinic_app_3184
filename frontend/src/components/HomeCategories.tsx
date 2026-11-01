import { Section, Grid, Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon, IconName } from '../components/icons';

export interface HomeCategoriesStep {
  icon: IconName;
  title: string;
  description: string;
}

export interface HomeCategoriesProps {
  steps?: HomeCategoriesStep[];
}

const DEFAULT_STEPS: HomeCategoriesStep[] = [
  {
    icon: 'calendar',
    title: 'Book your exam',
    description:
      'Choose the body part and preferred time. Our reception team confirms your X-ray slot and assigns an imaging room.',
  },
  {
    icon: 'map-pin',
    title: 'Visit the clinic',
    description:
      'Arrive at your scheduled time, check in at the front desk, and a technologist will take you to the exam room.',
  },
  {
    icon: 'book',
    title: 'Get your report',
    description:
      'A radiologist reviews your images and publishes findings and conclusion straight to your patient dashboard.',
  },
];

export default function HomeCategories({ steps = DEFAULT_STEPS }: HomeCategoriesProps) {
  return (
    <Section
      eyebrow="How it works"
      title="From booking to results, in three steps"
      subtitle="A clear path through your visit, from scheduling an X-ray to reading the radiologist's report."
    >
      <Grid size="sm">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardBody>
              <Icon name={step.icon} size={28} />
              <CardTitle>{step.title}</CardTitle>
              <CardMeta>{step.description}</CardMeta>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}