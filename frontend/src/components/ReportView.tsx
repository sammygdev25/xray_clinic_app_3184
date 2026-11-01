import type { Report } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge } from './ui';
import { Icon } from './icons';

interface ReportViewProps {
  report: Report;
}

export function ReportView({ report }: ReportViewProps) {
  const radiologistName = report.radiologist
    ? report.radiologist.phone || report.radiologist.role || 'Unassigned'
    : 'Unassigned';

  const createdDate = report.createdAt
    ? new Date(report.createdAt).toLocaleString()
    : '';

  return (
    <Card>
      <CardBody>
        <div className="ds-between">
          <CardTitle>Radiology Report</CardTitle>
          <Badge tone="success">
            <Icon name="check" size={14} /> Finalized
          </Badge>
        </div>
        <CardMeta>
          <Icon name="user" size={14} /> {radiologistName}
          {createdDate && (
            <>
              {' · '}
              <Icon name="clock" size={14} /> {createdDate}
            </>
          )}
        </CardMeta>

        <div className="ds-stack" style={{ marginTop: '1rem' }}>
          <div>
            <h4 className="ds-eyebrow">Findings</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{report.findings}</p>
          </div>

          {report.conclusion && (
            <div>
              <h4 className="ds-eyebrow">Conclusion</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{report.conclusion}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default ReportView;
