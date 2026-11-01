import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Media, Badge, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Room } from '../types';

interface HomeFeaturedProps {
  rooms: Room[];
  loading?: boolean;
}

export default function HomeFeatured({ rooms, loading }: HomeFeaturedProps) {
  return (
    <Section
      eyebrow="Our facility"
      title="Featured imaging rooms"
      subtitle="Modern, well-maintained X-ray rooms staffed by experienced radiologists and receptionists."
    >
      {loading ? (
        <SkeletonCards count={6} />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon="image"
          title="No rooms available"
          text="Imaging rooms will appear here once the clinic adds them."
        />
      ) : (
        <Grid size="md" cols={3}>
          {rooms.slice(0, 8).map((room) => (
            <Card key={room.id}>
              <Media
                src=""
                alt={room.name}
                ratio="wide"
                badge={room.roomNumber ? `Room ${room.roomNumber}` : undefined}
              />
              <CardBody>
                <CardTitle>{room.name}</CardTitle>
                <CardMeta>
                  <Icon name="map-pin" size={14} /> Room {room.roomNumber}
                </CardMeta>
                <Badge tone={room.isActive ? 'success' : 'neutral'}>
                  {room.isActive ? 'Available' : 'Unavailable'}
                </Badge>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}