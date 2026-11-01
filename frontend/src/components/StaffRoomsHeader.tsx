import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffRoomsHeaderProps {
  roomCount?: number;
  onAddRoom?: () => void;
}

export default function StaffRoomsHeader({ roomCount, onAddRoom }: StaffRoomsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Reception"
      title="X-ray Rooms"
      subtitle={
        typeof roomCount === 'number'
          ? `${roomCount} room${roomCount === 1 ? '' : 's'} configured for imaging exams`
          : 'Manage the rooms available for scheduling patient exams'
      }
      actions={
        onAddRoom ? (
          <Button variant="primary" onClick={onAddRoom}>
            <Icon name="plus" size={18} />
            New Room
          </Button>
        ) : undefined
      }
    />
  );
}