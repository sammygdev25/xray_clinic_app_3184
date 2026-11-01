import { Section, Grid, Card, CardBody, CardTitle } from '../components/ui';
import { Icon } from '../components/icons';

interface ExamReportFormInfoProps {
  section?: string;
}

export default function ExamReportFormInfo(_props: ExamReportFormInfoProps) {
  return (
    <Section tight title="Good to know">
      <Grid size="sm">
        <Card>
          <CardBody>
            <CardTitle>
              <Icon name="clock" size={18} /> Reporting turnaround
            </CardTitle>
            <p className="ds-muted ds-small">
              Radiologists aim to read and finalize a report within 24 hours of a completed exam.
              Findings and conclusion are both required before the report can be saved.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>
              <Icon name="shield" size={18} /> Who can see this
            </CardTitle>
            <p className="ds-muted ds-small">
              Once saved, the report appears on the patient's exam detail page and in their
              dashboard. Only radiologists and receptionists can edit a report after it is written.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>
              <Icon name="info" size={18} /> What happens next
            </CardTitle>
            <p className="ds-muted ds-small">
              Saving this report does not change the exam's room or schedule. If an invoice is
              pending for this exam, billing staff can finalize it from the invoices page.
            </p>
          </CardBody>
        </Card>
      </Grid>
    </Section>
  );
}