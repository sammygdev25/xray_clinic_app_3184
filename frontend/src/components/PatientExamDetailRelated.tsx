import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Room } from '../types';

interface PatientExamDetailRelatedProps {
  rooms: Room[];
  currentRoomId?: number;
}

export default function PatientExamDetailRelated({ rooms, currentRoomId }: PatientExamDetailRelatedProps) {
  const related = rooms.filter((room) => room.id !== currentRoomId).slice(0, 6);

  if (related.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Clinic rooms"
      title="Other imaging rooms"
      subtitle="These rooms are also equipped for X-ray exams at our clinic."
    >
      <Grid size="sm">
        {related.map((room) => (
          <Card key={room.id}>
            <CardBody>
              <CardTitle>
                <Icon name="map-pin" size={16} /> {room.name}
              </CardTitle>
              <CardMeta>Room {room.roomNumber}</CardMeta>
              <Badge tone={room.isActive ? 'success' : 'neutral'}>
                {room.isActive ? 'Available' : 'Inactive'}
              </Badge>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}