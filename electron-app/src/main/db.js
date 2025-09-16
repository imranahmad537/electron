import Database from 'better-sqlite3'
import { fileURLToPath} from 'url';
import { app, dialog } from 'electron'
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

let db
// For __dirname replacement in ESM
const __dbfilename = fileURLToPath(import.meta.url);
const __dbdirname = path.dirname(__dbfilename);



const myKey = process.env.APP_KEY
console.log(myKey);


const hashedKey = crypto.createHash('sha256').update(myKey).digest('hex');

export function initDb() {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'mydatabase.db')
    db = new Database(dbPath)

    db.exec(`
  PRAGMA journal_mode = WAL;
`)
      db.exec(`

CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
role TEXT NOT NULL CHECK(role IN ('admin','user')),
created_at TEXT DEFAULT (datetime('now'))
);
`);
  

    //---------------------------------------
    db.prepare(
      `CREATE TABLE IF NOT EXISTS license_table(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_key TEXT NOT NULL)
        `).run();

        
        // customer_id - contact No
        db.prepare(`
          CREATE TABLE IF NOT EXISTS orders(
          
          order_id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_name TEXT NOT NULL,
          customer_address TEXT,
          marble_type TEXT NOT NULL,
          marble_category TEXT NOT NULL,
          marble_length REAL NOT NULL,
          marble_width REAL NOT NULL,
          unit_price REAL NOT NULL,
          total_amount REAL NOT NULL,
          paid_amount REAL NOT NULL,
          remaining_amount REAL NOT NULL,
          payment_status TEXT CHECK(payment_status IN ('PAID', 'PARTIAL')) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`
        ).run()
        //  payment_status TEXT CHECK(payment_status IN ('PAID', 'PARTIAL', 'UNPAID')) NOT NULL,
    
    // Save fingerprint if not already saved

    //---------------------------------------
    // create a simple table
    db.prepare(
      `
        CREATE TABLE IF NOT EXISTS testUsers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
        )
        `
    ).run()
    const row = db.prepare('SELECT id FROM license_table LIMIT 1').get();
    if(!row){
      db.prepare('INSERT INTO license_table (license_key) VALUES (?)').run(hashedKey)
      console.log("Key stored successfully...");
    }

    const admin = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin')

  if (!admin) {
    const username = 'admin' // change later
    const password = 'admin' // change later
    const hash = bcrypt.hashSync(password, 10)
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?,?,?)').run(
      username,
      hash,
      'admin'
    )
    console.log('[DB] Seeded default admin account: "admin"')
  }

    // create Tables

    console.log('Database Connected Successfully at ', dbPath)
  }
  return db;
}


// db.js
// export function checkLicenseKey(inputKey) {
//   const row = db.prepare("SELECT license_key FROM license_table LIMIT 1").get();
//   if (!row) {
//     return false; // no license stored
//   }

//   const inputHash = crypto
//     .createHash("sha256")
//     .update(inputKey)
//     .digest("hex");

//   return inputHash === row.license_key;
// }

export function checkLicenseKey(inputKey) {
  const row = db.prepare("SELECT license_key FROM license_table LIMIT 1").get();
  if (!row) {
    dialog.showErrorBox("Unauthorized", "License key not found. App will quit.");
    app.quit();
    return false;
  }
   const inputHash = crypto
    .createHash("sha256")
    .update(inputKey)
    .digest("hex");

    if(inputHash === row.license_key){
      return true;// valid, proceed to login
    }else{
      dialog.showErrorBox("Unauthorized", "Invalid license key.")
      app.quit()
      return false;
    }

}
// Function to get machine fingerprint
    // function getMachineFingerprint() {
    //     const SALT = "wewillmeet"
    //   const macs = Object.values(os.networkInterfaces())
    //     .flat()
    //     .filter((nic) => nic && !nic.internal && nic.mac !== '00:00:00:00:00:00')
    //     .map((nic) => nic.mac)
    //     .join('-')

    //   return crypto.createHash('sha256').update(SALT + macs).digest('hex')
    // }
// export function checkLicense() {
//   const currentFingerprint = getMachineFingerprint()
//   const row = db.prepare('SELECT fingerprint FROM license LIMIT 1').get()

//   if (!row) {
//     // First run → save fingerprint
//     db.prepare('INSERT INTO license (fingerprint) VALUES (?)').run(currentFingerprint)
//     console.log('✅ License bound to this machine')
//     return true
//   }

//   if (row.fingerprint === currentFingerprint) {
//     console.log('✅ License check passed')
//     return true
//   } else {
//     console.log('❌ License check failed - different machine')
//     return false
//   }
// }
