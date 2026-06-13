import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Property, Testimonial, Inquiry } from '../src/types';
import { PROPERTIES_DATA, TESTIMONIALS_DATA } from '../src/data';

// Database JSON path in project root
const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  ip?: string;
  timestamp: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  date: string;
}

export interface DatabaseSchema {
  properties: Property[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  subscribers: NewsletterSubscriber[];
  logs: ActivityLog[];
  admins: {
    email: string;
    passwordHash: string;
    resetToken?: string;
    resetTokenExpiry?: number;
  }[];
}

// Initial state
let dbState: DatabaseSchema = {
  properties: [],
  inquiries: [],
  testimonials: [],
  subscribers: [],
  logs: [],
  admins: []
};

// Check if file exists and load, otherwise initialize
export function initDb() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      dbState = JSON.parse(data);
      // Ensure all fields exist
      if (!dbState.properties) dbState.properties = [];
      if (!dbState.inquiries) dbState.inquiries = [];
      if (!dbState.testimonials) dbState.testimonials = [];
      if (!dbState.subscribers) dbState.subscribers = [];
      if (!dbState.logs) dbState.logs = [];
      if (!dbState.admins) dbState.admins = [];
    } else {
      // Seed initial data
      dbState = {
        properties: PROPERTIES_DATA || [],
        inquiries: [],
        testimonials: TESTIMONIALS_DATA || [],
        subscribers: [],
        logs: [],
        admins: []
      };
      saveDb();
    }

    // Seed or synchronize admin credentials to ensure they always work with current env/defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'groupswastik8@gmail.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'swastik2220';
    const existingAdmin = dbState.admins.find(a => a.email.toLowerCase() === adminEmail.toLowerCase());
    
    // Always compute the hash on startup to handle custom environment variables or fallback
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPass, salt);

    if (!existingAdmin) {
      dbState.admins.push({
        email: adminEmail,
        passwordHash: hash
      });
      dbState.logs.push({
        id: `log-${Date.now()}-seed`,
        action: 'DB_INIT',
        details: `Seeded default administrator: ${adminEmail}`,
        timestamp: new Date().toISOString()
      });
      saveDb();
    } else {
      // Synchronize the hash to match the current runtime environment variable or fallback
      existingAdmin.passwordHash = hash;
      dbState.logs.push({
        id: `log-${Date.now()}-sync`,
        action: 'DB_PASSWORD_SYNC',
        details: `Synchronized administrator password on startup for: ${adminEmail}`,
        timestamp: new Date().toISOString()
      });
      saveDb();
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

export function saveDb() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database save error:', err);
  }
}

// Database helper endpoints
export const db = {
  properties: {
    getAll: () => dbState.properties,
    getById: (id: string) => dbState.properties.find(p => p.id === id),
    save: (prop: Property) => {
      const index = dbState.properties.findIndex(p => p.id === prop.id);
      if (index >= 0) {
        dbState.properties[index] = prop;
      } else {
        dbState.properties.push(prop);
      }
      saveDb();
    },
    delete: (id: string) => {
      dbState.properties = dbState.properties.filter(p => p.id !== id);
      saveDb();
    }
  },
  inquiries: {
    getAll: () => dbState.inquiries,
    getById: (id: string) => dbState.inquiries.find(i => i.id === id),
    save: (inquiry: Inquiry) => {
      dbState.inquiries.push(inquiry);
      saveDb();
    },
    delete: (id: string) => {
      dbState.inquiries = dbState.inquiries.filter(i => i.id !== id);
      saveDb();
    }
  },
  testimonials: {
    getAll: () => dbState.testimonials,
    save: (test: Testimonial) => {
      const index = dbState.testimonials.findIndex(t => t.id === test.id);
      if (index >= 0) {
        dbState.testimonials[index] = test;
      } else {
        dbState.testimonials.push(test);
      }
      saveDb();
    },
    delete: (id: string) => {
      dbState.testimonials = dbState.testimonials.filter(t => t.id !== id);
      saveDb();
    }
  },
  subscribers: {
    getAll: () => dbState.subscribers,
    add: (email: string) => {
      if (!dbState.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        dbState.subscribers.push({
          id: `sub-${Date.now()}`,
          email,
          date: new Date().toISOString()
        });
        saveDb();
        return true;
      }
      return false;
    }
  },
  logs: {
    getAll: () => dbState.logs,
    add: (action: string, details: string, ip?: string) => {
      dbState.logs.push({
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        action,
        details,
        ip,
        timestamp: new Date().toISOString()
      });
      // Cap log size to 300 entries to prevent memory inflation
      if (dbState.logs.length > 300) {
        dbState.logs.shift();
      }
      saveDb();
    }
  },
  admins: {
    getByEmail: (email: string) => dbState.admins.find(a => a.email.toLowerCase() === email.toLowerCase()),
    save: (admin: typeof dbState.admins[0]) => {
      const idx = dbState.admins.findIndex(a => a.email.toLowerCase() === admin.email.toLowerCase());
      if (idx >= 0) {
        dbState.admins[idx] = admin;
      } else {
        dbState.admins.push(admin);
      }
      saveDb();
    }
  }
};
