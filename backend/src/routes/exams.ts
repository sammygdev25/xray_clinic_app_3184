import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff, requireRole } from '../middleware/auth';

const router = Router();

const createExamSchema = z.object({
  patientId: z.number().int().positive(),
  roomId: z.number().int().positive(),
  bodyPart: z.string().min(1).max(100),
  scheduledAt: z.coerce.date(),
});

const updateExamSchema = z.object({
  roomId: z.number().int().positive().optional(),
  bodyPart: z.string().min(1).max(100).optional(),
  scheduledAt: z.coerce.date().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const patientSelect = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
};

// GET /api/exams/ - patients see their own exams; receptionists/radiologists see all
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const where = user.role === 'patient' ? { patientId: user.id } : {};

    const exams = await prisma.exam.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      include: {
        patient: { select: patientSelect },
        room: true,
        createdBy: { select: patientSelect },
      },
    });
    res.json(exams);
  } catch (error) {
    next(error);
  }
});

// GET /api/exams/:id - a patient may view only their own exam; staff may view any
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: parsedParams.data.id },
      include: {
        patient: { select: patientSelect },
        room: true,
        createdBy: { select: patientSelect },
      },
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (user.role === 'patient' && exam.patientId !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(exam);
  } catch (error) {
    next(error);
  }
});

// POST /api/exams/ - staff (receptionist/radiologist) schedule an exam for a patient
router.post('/', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createExamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const patient = await prisma.user.findUnique({ where: { id: parsed.data.patientId } });
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const room = await prisma.room.findUnique({ where: { id: parsed.data.roomId } });
    if (!room || !room.isActive) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const exam = await prisma.exam.create({
      data: {
        patientId: parsed.data.patientId,
        roomId: parsed.data.roomId,
        bodyPart: parsed.data.bodyPart,
        scheduledAt: parsed.data.scheduledAt,
        createdById: req.userId,
        status: 'scheduled',
      },
      include: {
        patient: { select: patientSelect },
        room: true,
        createdBy: { select: patientSelect },
      },
    });
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/exams/:id - staff update exam details or status
router.patch('/:id', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateExamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.exam.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (parsed.data.roomId !== undefined) {
      const room = await prisma.room.findUnique({ where: { id: parsed.data.roomId } });
      if (!room || !room.isActive) {
        return res.status(404).json({ error: 'Room not found' });
      }
    }

    const exam = await prisma.exam.update({
      where: { id: parsedParams.data.id },
      data: { ...parsed.data },
      include: {
        patient: { select: patientSelect },
        room: true,
        createdBy: { select: patientSelect },
      },
    });
    res.json(exam);
  } catch (error) {
    next(error);
  }
});

export default router;
