import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./files.db');

export function database() {
  return {
    init: async () => {
      await new Promise<void>((resolve, reject) => {
        db.run(`CREATE TABLE files (
        name VARCHAR(255) NOT NULL UNIQUE,
        path VARCHAR(255) NOT NULL
      )`, (err) => {
          if (err) { reject() } else { resolve() }
        })
      });
    },
    has: async (name: string) => {
      const has_file = await new Promise<boolean>((resolve, reject) => {
        db.get(`SELECT * FROM files WHERE name = ?`, [name], (err, row) => {
          if (err) { reject() } else { resolve(!!row) }
        })
      });
      return has_file;
    },
    add: async (name: string, path: string) => {
      await new Promise<void>((resolve, reject) => {
        db.run(`INSERT INTO files (name, path) VALUES (?, ?)`, [name, path], (err) => {
          console.error(err);
          if (err) { reject() } else { resolve() }
        })
      });
    },
    get: async (name: string): Promise<{ name: string, path: string } | null> => {
      const file = await new Promise<{ name: string, path: string }>((resolve, reject) => {
        db.get(`SELECT * FROM files WHERE name = ?`, [name], (err, row) => {
          if (err) { reject() } else { resolve(row as any ?? null) }
        })
      });
      return file;
    },
    rm: async (name: string) => {
      await new Promise<void>((resolve, reject) => {
        db.run(`DELETE FROM files WHERE name = ?`, [name], (err) => {
          if (err) { reject() } else { resolve() }
        })
      });
    }
  }
}
