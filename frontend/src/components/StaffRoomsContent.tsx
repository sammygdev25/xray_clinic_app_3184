import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Room } from '../types';

interface StaffRoomsContentProps {
  rooms: Room[];
  loading: boolean;
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export default function StaffRoomsContent({ rooms, loading, onEdit, onDelete, onAddNew }: StaffRoomsContentProps) {
  if (loading) {
    return (
      <Section title="Imaging Rooms" subtitle="Rooms available for X-ray exams">
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (rooms.length === 0) {
    return (
      <Section title="Imaging Rooms" subtitle="Rooms available for X-ray exams">
        <EmptyState
          icon="home"
          title="No rooms yet"
          text="Add the clinic's first imaging room to start scheduling exams."
          action={
            <Button variant="primary" onClick={onAddNew}>
              <Icon name="plus" size={16} /> Add room
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section
      title="Imaging Rooms"
      subtitle="Rooms available for X-ray exams"
      actions={
        <Button variant="primary" onClick={onAddNew}>
          <Icon name="plus" size={16} /> Add room
        </Button>
      }
    >
      <Grid size="sm" cols={3}>
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardBody>
              <CardTitle>{room.name}</CardTitle>
              <CardMeta>Room No. {room.roomNumber}</CardMeta>
              <Badge tone={room.isActive ? 'success' : 'neutral'}>
                {room.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" size="md" onClick={() => onEdit(room)}>
                <Icon name="edit" size={16} /> Edit
              </Button>
              <Button variant="danger" size="md" onClick={() => onDelete(room.id)}>
                <Icon name="trash" size={16} /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}