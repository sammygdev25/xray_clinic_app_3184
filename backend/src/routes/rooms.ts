import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, requireStaff, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  roomNumber: z.string().min(1).max(20),
  isActive: z.boolean().optional(),
});

const updateRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  roomNumber: z.string().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/rooms/
router.get('/', authMiddleware, requireStaff, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/:id
router.get('/:id', authMiddleware, requireStaff, async (req: Request, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.id },
    });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
});

// POST /api/rooms/ (receptionist/staff only)
router.post('/', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const room = await prisma.room.create({
      data: {
        name: parsed.data.name,
        roomNumber: parsed.data.roomNumber,
        isActive: parsed.data.isActive ?? true,
      },
    });
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
});

// PUT /api/rooms/:id (receptionist/staff only)
router.put('/:id', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.room.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const room = await prisma.room.update({
      where: { id: parsedParams.data.id },
      data: parsed.data,
    });
    res.json(room);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/rooms/:id (receptionist/staff only)
router.delete('/:id', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const existing = await prisma.room.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Room not found' });
    }
    await prisma.room.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;