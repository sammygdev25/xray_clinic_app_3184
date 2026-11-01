import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // A seeded database is never seeded twice (the image runs this on every boot with SEED_DEMO=1).
  if ((await prisma.user.count()) > 0 && process.env.SEED_FORCE !== '1') {
    console.log('Seed skipped: the database already has users (SEED_FORCE=1 seeds anyway).');
    return;
  }

  // Create demo user
  // The demo password is this project's own (SEED_DEMO_PASSWORD in backend/.env, made at generation, never shipped):
  // no generated app shares a known password. Without it there are no demo accounts and no demo data.
  const demoPassword = process.env.SEED_DEMO_PASSWORD || '';
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD is not set: no demo accounts and no demo data.');
    return;
  }
  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // The receptionist account, with its own password (SEED_RECEPTIONIST_PASSWORD in backend/.env); without it there is none.
  const receptionistPassword = process.env.SEED_RECEPTIONIST_PASSWORD || '';
  if (receptionistPassword) {
    await prisma.user.upsert({
      where: { email: 'receptionist@example.com' },
      update: {},
      create: {
        username: 'receptionist',
        email: 'receptionist@example.com',
        password: await bcrypt.hash(receptionistPassword, 10),
        firstName: 'Demo',
        lastName: 'Receptionist',
        role: 'receptionist',
      },
    });
  }

  // The radiologist account, with its own password (SEED_RADIOLOGIST_PASSWORD in backend/.env); without it there is none.
  const radiologistPassword = process.env.SEED_RADIOLOGIST_PASSWORD || '';
  if (radiologistPassword) {
    await prisma.user.upsert({
      where: { email: 'radiologist@example.com' },
      update: {},
      create: {
        username: 'radiologist',
        email: 'radiologist@example.com',
        password: await bcrypt.hash(radiologistPassword, 10),
        firstName: 'Demo',
        lastName: 'Radiologist',
        role: 'radiologist',
      },
    });
  }

  // Domain seed data
  const ids: Record<string, number[]> = {};
  const pick = (list: number[] | undefined, n: number): number => (list && list.length ? list[(n - 1) % list.length] : n);
  ids.User = (await prisma.user.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  try {
    await prisma.room.create({ data: { name: 'Radiography Suite A', roomNumber: '101', isActive: true } });
    await prisma.room.create({ data: { name: 'Radiography Suite B', roomNumber: '102', isActive: true } });
    await prisma.room.create({ data: { name: 'Chest Imaging Room', roomNumber: '103', isActive: true } });
    await prisma.room.create({ data: { name: 'Orthopedic X-ray Room', roomNumber: '104', isActive: true } });
    ids.Room = (await prisma.room.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Room skipped:', e); }
  try {
    await prisma.exam.create({ data: { patientId: 1, roomId: pick(ids.Room, 3), createdById: 1, bodyPart: 'Chest', scheduledAt: new Date(), status: 'scheduled' } });
    await prisma.exam.create({ data: { patientId: 2, roomId: pick(ids.Room, 4), createdById: 2, bodyPart: 'Left Wrist', scheduledAt: new Date(), status: 'completed' } });
    await prisma.exam.create({ data: { patientId: 3, roomId: pick(ids.Room, 10), createdById: 3, bodyPart: 'Lumbar Spine', scheduledAt: new Date(), status: 'cancelled' } });
    await prisma.exam.create({ data: { patientId: 4, roomId: pick(ids.Room, 4), createdById: 4, bodyPart: 'Right Knee', scheduledAt: new Date(), status: 'scheduled' } });
    await prisma.exam.create({ data: { patientId: 5, roomId: pick(ids.Room, 1), createdById: 5, bodyPart: 'Skull', scheduledAt: new Date(), status: 'completed' } });
    await prisma.exam.create({ data: { patientId: 6, roomId: pick(ids.Room, 2), createdById: 6, bodyPart: 'Pelvis', scheduledAt: new Date(), status: 'cancelled' } });
    await prisma.exam.create({ data: { patientId: 7, roomId: pick(ids.Room, 6), createdById: 7, bodyPart: 'Abdomen', scheduledAt: new Date(), status: 'scheduled' } });
    await prisma.exam.create({ data: { patientId: 8, roomId: pick(ids.Room, 9), createdById: 8, bodyPart: 'Right Ankle', scheduledAt: new Date(), status: 'completed' } });
    await prisma.exam.create({ data: { patientId: 9, roomId: pick(ids.Room, 10), createdById: 9, bodyPart: 'Cervical Spine', scheduledAt: new Date(), status: 'cancelled' } });
    await prisma.exam.create({ data: { patientId: 10, roomId: pick(ids.Room, 8), createdById: 10, bodyPart: 'Jaw', scheduledAt: new Date(), status: 'scheduled' } });
    ids.Exam = (await prisma.exam.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Exam skipped:', e); }
  try {
    await prisma.report.create({ data: { examId: pick(ids.Exam, 1), radiologistId: pick(ids.User, 1), findings: 'No active infiltrates or consolidation. Heart size within normal limits. Clear costophrenic angles.', conclusion: 'Normal chest radiograph.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 2), radiologistId: pick(ids.User, 2), findings: 'Mild dorsal displacement of distal radius fragment with cortical disruption noted.', conclusion: 'Findings consistent with Colles\' fracture.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 3), radiologistId: pick(ids.User, 3), findings: 'Mild loss of disc height at L4-L5 with marginal osteophyte formation.', conclusion: 'Degenerative disc disease at L4-L5 level.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 4), radiologistId: pick(ids.User, 4), findings: 'Narrowing of medial joint compartment with subchondral sclerosis observed.', conclusion: 'Osteoarthritis of the right knee, moderate severity.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 5), radiologistId: pick(ids.User, 5), findings: 'No fracture or lytic lesion identified. Sutures appear normal for age.', conclusion: 'Unremarkable skull radiograph.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 6), radiologistId: pick(ids.User, 6), findings: 'Bilateral sacroiliac joints appear symmetric. No fracture of pelvic ring detected.', conclusion: 'Normal pelvic series.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 7), radiologistId: pick(ids.User, 7), findings: 'Nonspecific bowel gas pattern. No free air under diaphragm.', conclusion: 'No evidence of obstruction or perforation.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 8), radiologistId: pick(ids.User, 8), findings: 'Lateral malleolus shows a nondisplaced fracture line.', conclusion: 'Nondisplaced fracture of the lateral malleolus.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 9), radiologistId: pick(ids.User, 9), findings: 'Straightening of normal cervical lordosis, likely due to muscle spasm.', conclusion: 'No acute fracture of cervical spine.' } });
    await prisma.report.create({ data: { examId: pick(ids.Exam, 10), radiologistId: pick(ids.User, 10), findings: 'Impacted lower third molar noted with adjacent bone resorption.', conclusion: 'Impacted mandibular third molar requiring referral.' } });
    ids.Report = (await prisma.report.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Report skipped:', e); }
  try {
    await prisma.invoice.create({ data: { patientId: 1, examId: pick(ids.Exam, 1), createdById: 1, amount: 24.50, status: 'unpaid', paidAt: null } });
    await prisma.invoice.create({ data: { patientId: 2, examId: pick(ids.Exam, 2), createdById: 2, amount: 38.00, status: 'paid', paidAt: new Date() } });
    await prisma.invoice.create({ data: { patientId: 3, examId: pick(ids.Exam, 3), createdById: 3, amount: 17.25, status: 'cancelled', paidAt: null } });
    await prisma.invoice.create({ data: { patientId: 4, examId: pick(ids.Exam, 4), createdById: 4, amount: 52.75, status: 'unpaid', paidAt: null } });
    await prisma.invoice.create({ data: { patientId: 5, examId: pick(ids.Exam, 5), createdById: 5, amount: 29.00, status: 'paid', paidAt: new Date() } });
    await prisma.invoice.create({ data: { patientId: 6, examId: pick(ids.Exam, 6), createdById: 6, amount: 44.50, status: 'cancelled', paidAt: null } });
    await prisma.invoice.create({ data: { patientId: 7, examId: pick(ids.Exam, 7), createdById: 7, amount: 21.75, status: 'unpaid', paidAt: null } });
    await prisma.invoice.create({ data: { patientId: 8, examId: pick(ids.Exam, 8), createdById: 8, amount: 33.00, status: 'paid', paidAt: new Date() } });
    await prisma.invoice.create({ data: { patientId: 9, examId: pick(ids.Exam, 9), createdById: 9, amount: 61.25, status: 'cancelled', paidAt: null } });
    await prisma.invoice.create({ data: { patientId: 10, examId: pick(ids.Exam, 10), createdById: 10, amount: 26.50, status: 'unpaid', paidAt: null } });
    ids.Invoice = (await prisma.invoice.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Invoice skipped:', e); }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
