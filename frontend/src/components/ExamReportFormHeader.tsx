import type { Exam } from '../types';
import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface ExamReportFormHeaderProps {
  exam?: Exam;
  isEdit?: boolean;
}

export default function ExamReportFormHeader({ exam, isEdit }: ExamReportFormHeaderProps) {
  const bodyPart = exam?.bodyPart ?? 'exam';
  const patientName = exam?.patient?.phone ?? 'the patient';

  return (
    <PageHeader
      eyebrow="Radiology report"
      title={isEdit ? `Edit report — ${bodyPart} X-ray` : `Write report — ${bodyPart} X-ray`}
      subtitle={`Record the findings and conclusion for ${patientName}'s ${bodyPart} exam so it can be shared on their dashboard.`}
      actions={
        <span className="ds-cluster" style={{ color: 'var(--color-text-secondary)' }}>
          <Icon name="info" size={16} />
          Findings become visible to the patient once saved.
        </span>
      }
    />
  );
}
