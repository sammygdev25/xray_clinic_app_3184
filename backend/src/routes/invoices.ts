import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest, requireStaff, requireRole } from '../middleware/auth';

const router = Router();

const createInvoiceSchema = z.object({
  patientId: z.number().int().positive(),
  examId: z.number().int().positive().optional().nullable(),
  amount: z.number().positive(),
});

const updateInvoiceSchema = z.object({
  status: z.enum(['unpaid', 'paid', 'cancelled']),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const queryPatientSchema = z.object({
  patient: z.coerce.number().int().positive().optional(),
});

const userSummarySelect = {
  id: true,
  email: true,
  phone: true,
  role: true,
};

// GET /api/invoices/
router.get('/', authMiddleware, requireRole('patient', 'receptionist'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const parsedQuery = queryPatientSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: parsedQuery.error.issues });
    }

    const isStaff = user.role === 'receptionist' || user.role === 'radiologist';

    const where: any = {};
    if (!isStaff) {
      where.patientId = req.userId;
    } else if (parsedQuery.data.patient) {
      where.patientId = parsedQuery.data.patient;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: { select: userSummarySelect },
        exam: true,
      },
    });

    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices/ (receptionist/radiologist only)
router.post('/', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createInvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  try {
    const patient = await prisma.user.findUnique({ where: { id: parsed.data.patientId } });
    if (!patient || patient.role !== 'patient') {
      return res.status(400).json({ error: 'Invalid patient' });
    }

    if (parsed.data.examId) {
      const exam = await prisma.exam.findUnique({ where: { id: parsed.data.examId } });
      if (!exam) {
        return res.status(400).json({ error: 'Invalid exam' });
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        patientId: parsed.data.patientId,
        examId: parsed.data.examId ?? null,
        amount: parsed.data.amount,
        status: 'unpaid',
        createdById: req.userId,
      },
      include: {
        patient: { select: userSummarySelect },
        exam: true,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/invoices/:id/ (receptionist/radiologist only) - update status
router.patch('/:id', authMiddleware, requireRole('receptionist'), requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }

  const parsedBody = updateInvoiceSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsedBody.error.issues });
  }

  try {
    const existing = await prisma.invoice.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = await prisma.invoice.update({
      where: { id: parsedParams.data.id },
      data: { status: parsedBody.data.status },
      include: {
        patient: { select: userSummarySelect },
        exam: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

export default router;
