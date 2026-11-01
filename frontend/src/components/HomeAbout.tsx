import { Section, Split, Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { IconName } from '../components/icons';

interface ValuePoint {
  icon: IconName;
  title: string;
  text: string;
}

interface HomeAboutProps {
  heading?: string;
  story?: string[];
  values?: ValuePoint[];
}

const defaultStory = [
  "Riverside Radiology Center was founded to make diagnostic imaging fast, accurate, and stress-free. Our team of receptionists and board-certified radiologists works together every day to get patients in front of the right equipment and their results back to the referring doctor without delay.",
  "From a routine chest X-ray to a complex extremity study, every exam is scheduled into a dedicated room, tracked from check-in to final report, and billed transparently — so patients always know where things stand.",
];

const defaultValues: ValuePoint[] = [
  {
    icon: 'clock',
    title: 'Fast turnaround',
    text: 'Most reports are finalized by our radiologists within 24 hours of the exam.',
  },
  {
    icon: 'shield',
    title: 'Accurate, reviewed reads',
    text: 'Every image is read by a licensed radiologist and documented with clear findings and conclusions.',
  },
  {
    icon: 'users',
    title: 'Patient-first scheduling',
    text: 'Our front desk keeps exam rooms moving so you spend less time waiting and more time getting answers.',
  },
];

export default function HomeAbout({
  heading = 'About our clinic',
  story = defaultStory,
  values = defaultValues,
}: HomeAboutProps) {
  return (
    <Section eyebrow="Who we are" title={heading}>
      <Split>
        <div className="ds-stack">
          {story.map((paragraph, idx) => (
            <p key={idx} className="ds-lead">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="ds-stack">
          {values.map((value) => (
            <Card key={value.title}>
              <CardBody>
                <div className="ds-cluster">
                  <Icon name={value.icon} size={20} />
                  <CardTitle>{value.title}</CardTitle>
                </div>
                <CardMeta>{value.text}</CardMeta>
              </CardBody>
            </Card>
          ))}
        </div>
      </Split>
    </Section>
  );
}