import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(join(__dirname, 'checkins.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create check_ins table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS check_ins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        badge_number TEXT NOT NULL,
        title TEXT NOT NULL,
        investigative_role TEXT NOT NULL,
        department_number TEXT NOT NULL,
        defendant_name TEXT NOT NULL,
        phone_number TEXT,
        case_number TEXT,
        additional_comments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE,
        flagged BOOLEAN DEFAULT FALSE
      )
    `);
  }
});

// Get all check-ins
app.get('/api/check-ins', (req, res) => {
  db.all('SELECT * FROM check_ins ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new check-in
app.post('/api/check-ins', (req, res) => {
  const {
    name,
    badge_number,
    title,
    investigative_role,
    department_number,
    defendant_name,
    phone_number,
    case_number,
    additional_comments
  } = req.body;

  db.run(
    `INSERT INTO check_ins (
      name, badge_number, title, investigative_role, department_number,
      defendant_name, phone_number, case_number, additional_comments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, badge_number, title, investigative_role, department_number,
     defendant_name, phone_number, case_number, additional_comments],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Verify check-in
app.put('/api/check-ins/:id/verify', (req, res) => {
  db.run(
    'UPDATE check_ins SET verified = TRUE, flagged = FALSE WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Check-in verified successfully' });
    }
  );
});

// Flag check-in
app.put('/api/check-ins/:id/flag', (req, res) => {
  db.run(
    'UPDATE check_ins SET verified = FALSE, flagged = TRUE WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Check-in flagged successfully' });
    }
  );
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});