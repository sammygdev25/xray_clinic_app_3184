import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

const createReportSchema = z.object({
  examId: z.number().int().positive(),
  findings: z.string().min(1),
  conclusion: z.string().optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/reports/
router.get('/', authMiddleware, requireRole('patient', 'radiologist'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const where =
      user.role === 'patient'
        ? { exam: { patientId: user.id } }
        : {};

    const reports = await prisma.report.findMany({
      where,
      include: {
        exam: {
          include: {
            patient: true,
            room: true,
          },
        },
        radiologist: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// POST /api/reports/ (radiologists only)
router.post(
  '/',
  authMiddleware,
  requireRole('radiologist'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const parsed = createReportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
    }

    try {
      const exam = await prisma.exam.findUnique({ where: { id: parsed.data.examId } });
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const report = await prisma.report.create({
        data: {
          examId: exam.id,
          radiologistId: req.userId,
          findings: parsed.data.findings,
          conclusion: parsed.data.conclusion ?? '',
        },
        include: {
          exam: {
            include: {
              patient: true,
              room: true,
            },
          },
          radiologist: true,
        },
      });

      await prisma.exam.update({
        where: { id: exam.id },
        data: { status: 'completed' },
      });

      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  }
);

export default router;