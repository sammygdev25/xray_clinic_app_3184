import type { Room } from '../types';
import { Button } from './ui';
import { Icon } from './icons';
import { EmptyState } from './ui';

interface RoomListProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export function RoomList({ rooms, onEdit, onDelete }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No rooms yet"
        text="Add an X-ray room to start scheduling exams."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Room number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.roomNumber}</td>
              <td>
                <span
                  className="badge"
                  style={{
                    background: room.isActive
                      ? 'var(--color-success)'
                      : 'var(--color-danger)',
                    color: 'var(--color-bg)',
                  }}
                >
                  {room.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="ds-cluster">
                  <Button variant="ghost" size="md" onClick={() => onEdit(room)}>
                    <Icon name="edit" size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" size="md" onClick={() => onDelete(room)}>
                    <Icon name="trash" size={16} />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomList;