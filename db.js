const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS points (user TEXT PRIMARY KEY, amount INTEGER DEFAULT 0)`);
  db.run(`CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, postedBy TEXT, createdAt INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, jobId INTEGER, answer TEXT, status TEXT, createdAt INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);
});

module.exports = db;
