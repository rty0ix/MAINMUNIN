import express from 'express';
import { initDatabase } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await initDatabase();
  const checkIns = db.execO('SELECT * FROM check_ins ORDER BY created_at DESC');
  res.json(checkIns);
});

router.post('/', async (req, res) => {
  const db = await initDatabase();
  const stmt = db.prepare(`
    INSERT INTO check_ins (
      name, badge_number, title, investigative_role, department_number,
      defendant_name, phone_number, case_number, additional_comments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    req.body.name,
    req.body.badge_number,
    req.body.title,
    req.body.investigative_role,
    req.body.department_number,
    req.body.defendant_name,
    req.body.phone_number,
    req.body.case_number,
    req.body.additional_comments
  );

  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id/verify', async (req, res) => {
  const db = await initDatabase();
  db.exec('UPDATE check_ins SET verified = TRUE, flagged = FALSE WHERE id = ?', [req.params.id]);
  res.json({ message: 'Check-in verified successfully' });
});

router.put('/:id/flag', async (req, res) => {
  const db = await initDatabase();
  db.exec('UPDATE check_ins SET verified = FALSE, flagged = TRUE WHERE id = ?', [req.params.id]);
  res.json({ message: 'Check-in flagged successfully' });
});

export default router;