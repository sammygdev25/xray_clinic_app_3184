import React, { useCallback, useEffect, useState } from 'react';
import { getRoomList, createRoom, updateRoom, deleteRoom } from '../api';
import type { Room } from '../types';
import StaffRoomsHeader from '../components/StaffRoomsHeader';
import StaffRoomsContent from '../components/StaffRoomsContent';
import RoomForm from '../components/RoomForm';
import { Alert } from '../components/ui';

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRoomList();
      setRooms(data);
    } catch (err) {
      console.error(err);
      setError('Could not load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleAddNew = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleSubmit = async (data: Partial<Room>) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, data);
      } else {
        const roomData: Omit<Room, 'id'> = {
          name: data.name ?? '',
          roomNumber: data.roomNumber ?? '',
          isActive: data.isActive ?? true,
          createdAt: data.createdAt ?? '',
          updatedAt: data.updatedAt ?? '',
        };
        await createRoom(roomData);
      }
      setShowForm(false);
      setEditingRoom(null);
      await loadRooms();
    } catch (err) {
      console.error(err);
      setError('Could not save the room. Please check the details and try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove this room? Exams already scheduled in it will keep their record.')) {
      return;
    }
    try {
      await deleteRoom(id);
      await loadRooms();
    } catch (err) {
      console.error(err);
      setError('Could not remove the room. Please try again.');
    }
  };

  return (
    <div className="ds-stack-lg">
      <StaffRoomsHeader roomCount={rooms.length} onAddRoom={handleAddNew} />
      {error && <Alert tone="danger">{error}</Alert>}
      {showForm && (
        <RoomForm room={editingRoom} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
      <StaffRoomsContent
        rooms={rooms}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />
    </div>
  );
}
