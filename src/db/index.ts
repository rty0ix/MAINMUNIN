import { createRxDatabase } from '@vlcn.io/rx-sqlite';

let db: any = null;

export async function initDatabase() {
  if (!db) {
    db = await createRxDatabase();
    
    await db.exec(`
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
  return db;
}