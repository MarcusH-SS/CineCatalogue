import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export interface LocalUser {
  id: number;
  uid: string | null;
  name: string;
  email: string;
  passwordHash: string;
  synced: number;
}

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('cinecatalogue.db')
      .then(async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            synced INTEGER DEFAULT 1
          );
        `);
        return db;
      })
      .catch((error: unknown) => {
        databasePromise = undefined;
        throw error;
      });
  }

  return databasePromise;
}

export async function initLocalAuthDB(): Promise<void> {
  await getDatabase();
}

async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password.trim()
  );
}

export async function saveUserLocally(
  name: string,
  email: string,
  password: string,
  uid: string | null = null,
  synced: number = 1
) {
  const passwordHash = await hashPassword(password);
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO users (uid, name, email, passwordHash, synced)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       uid = COALESCE(excluded.uid, users.uid),
       name = excluded.name,
       passwordHash = excluded.passwordHash,
       synced = excluded.synced;`,
    [uid, name.trim(), normalizedEmail, passwordHash, synced]
  );
}

export async function loginOffline(
  email: string,
  password: string
): Promise<LocalUser | null> {
  const passwordHash = await hashPassword(password);
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDatabase();

  const user = await db.getFirstAsync<LocalUser>(
    'SELECT * FROM users WHERE email = ? AND passwordHash = ?;',
    [normalizedEmail, passwordHash]
  );

  return user ?? null;
}