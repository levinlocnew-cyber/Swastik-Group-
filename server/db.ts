import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Property, Testimonial, Inquiry } from '../src/types';
import { PROPERTIES_DATA, TESTIMONIALS_DATA } from '../src/data';
import { isSupabaseConfigured, supabaseDb } from './supabase';

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

// Local state cache
let dbState: DatabaseSchema = {
  properties: [],
  inquiries: [],
  testimonials: [],
  subscribers: [],
  logs: [],
  admins: []
};

// Check if file exists and load, otherwise initialize local database driver
export function initLocalDb() {
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
      saveLocalDb();
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
      saveLocalDb();
    } else {
      // Synchronize the hash to match the current runtime environment variable or fallback
      existingAdmin.passwordHash = hash;
      dbState.logs.push({
        id: `log-${Date.now()}-sync`,
        action: 'DB_PASSWORD_SYNC',
        details: `Synchronized administrator password on startup for: ${adminEmail}`,
        timestamp: new Date().toISOString()
      });
      saveLocalDb();
    }
  } catch (err) {
    console.error('Local Database fallback initialization error:', err);
  }
}

export function saveLocalDb() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Local Database save error:', err);
  }
}

// Global Database Bootstrapper
export async function initDb() {
  // Always load local db first as baseline fallback
  initLocalDb();

  // If Supabase credentials are configured, check for connectivity & schema
  if (isSupabaseConfigured()) {
    console.log('[Supabase Detector] Found Supabase environment keys. Testing connections and tables...');
    try {
      // Test read of properties
      const cloudProps = await supabaseDb.properties.getAll();
      console.log(`✓ Connected to Supabase Database successfully! Found ${cloudProps.length} cloud properties.`);
      
      // Auto-Seeding if Supabase is connected but database table remains completely empty
      if (cloudProps.length === 0) {
        console.log('[Supabase Seeder] Connected Supabase property table is empty. Initializing initial Lucknow listings...');
        for (const list of PROPERTIES_DATA) {
          await supabaseDb.properties.save(list).catch(err => {
            console.warn(`[Supabase Seeder Warning] Failed listing upload: ${list.name}`, err.message);
          });
        }
      }

      // Check admin profiles
      const adminEmail = process.env.ADMIN_EMAIL || 'groupswastik8@gmail.com';
      const cloudAdmin = await supabaseDb.admins.getByEmail(adminEmail);
      if (!cloudAdmin) {
        console.log(`[Supabase Seeder] Syncing default administrator account (${adminEmail}) to cloud db...`);
        const adminPass = process.env.ADMIN_PASSWORD || 'swastik2220';
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(adminPass, salt);
        await supabaseDb.admins.save({
          email: adminEmail,
          passwordHash: hash
        });
      }

      // Test testimonials
      const cloudReviews = await supabaseDb.testimonials.getAll();
      if (cloudReviews.length === 0) {
        console.log('[Supabase Seeder] Empty testimonials cloud log. Syncing client reviews...');
        for (const r of TESTIMONIALS_DATA) {
          await supabaseDb.testimonials.save(r).catch(() => {});
        }
      }

      await supabaseDb.logs.add('DB_INIT', 'Server successfully established direct connectivity pipeline with Supabase clusters.', '127.0.0.1');
    } catch (err: any) {
      console.error('──────────────────────────────────────────────────────────────────');
      console.error('⚠ SUPABASE SQL TABLES AND SCHEMA ARE PENDING CONGREGATION! ⚠');
      console.error('Error detail:', err?.message || err);
      console.error('👉 ACTION REQUIRED: To enable Supabase Cloud Database mode:');
      console.error('   Copy and run the contents of "/supabase_setup.sql" in your Supabase SQL Editor.');
      console.error('👉 Bypassing safely: Hosting fallback on local db.json sandbox mode for now.');
      console.error('──────────────────────────────────────────────────────────────────');
    }
  } else {
    console.log('💡 Information: Supabase keys not defined yet. Utilizing local JSON sandbox storage (db.json) for state.');
  }
}

// ====================================================================
// ASYNCHRONOUS UNIFIED DATABASE ROUTER (CLIENT API CALL PROXIES)
// ====================================================================

export const db = {
  properties: {
    getAll: async (): Promise<Property[]> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.properties.getAll();
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Listing query error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.properties;
    },
    
    getById: async (id: string): Promise<Property | null> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.properties.getById(id);
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Profile lookup error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.properties.find(p => p.id === id) || null;
    },
    
    save: async (prop: Property): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.properties.save(prop);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Property save error. Synchronizing local fallback node.', e.message);
        }
      }
      
      const index = dbState.properties.findIndex(p => p.id === prop.id);
      if (index >= 0) {
        dbState.properties[index] = prop;
      } else {
        dbState.properties.push(prop);
      }
      saveLocalDb();
    },
    
    delete: async (id: string): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.properties.delete(id);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Property delete error. Forcing local sandbox execution.', e.message);
        }
      }
      
      dbState.properties = dbState.properties.filter(p => p.id !== id);
      saveLocalDb();
    }
  },

  inquiries: {
    getAll: async (): Promise<Inquiry[]> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.inquiries.getAll();
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Inquiries query error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.inquiries;
    },
    
    getById: async (id: string): Promise<Inquiry | null> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.inquiries.getById(id);
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Lead detail query error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.inquiries.find(i => i.id === id) || null;
    },
    
    save: async (inquiry: Inquiry): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.inquiries.save(inquiry);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Inquiry write error. Synchronizing local fallback node.', e.message);
        }
      }
      
      dbState.inquiries.push(inquiry);
      saveLocalDb();
    },
    
    delete: async (id: string): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.inquiries.delete(id);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Inquiry deletion error. Forcing local sandbox execution.', e.message);
        }
      }
      
      dbState.inquiries = dbState.inquiries.filter(i => i.id !== id);
      saveLocalDb();
    }
  },

  testimonials: {
    getAll: async (): Promise<Testimonial[]> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.testimonials.getAll();
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Testimonials fetch error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.testimonials;
    },
    
    save: async (test: Testimonial): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.testimonials.save(test);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Testimonials write error. Synchronizing local fallback node.', e.message);
        }
      }
      
      const index = dbState.testimonials.findIndex(t => t.id === test.id);
      if (index >= 0) {
        dbState.testimonials[index] = test;
      } else {
        dbState.testimonials.push(test);
      }
      saveLocalDb();
    },
    
    delete: async (id: string): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.testimonials.delete(id);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Testimonials deletion error. Forcing local sandbox execution.', e.message);
        }
      }
      
      dbState.testimonials = dbState.testimonials.filter(t => t.id !== id);
      saveLocalDb();
    }
  },

  subscribers: {
    getAll: async (): Promise<NewsletterSubscriber[]> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.subscribers.getAll();
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Subscribers list error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.subscribers;
    },
    
    add: async (email: string): Promise<boolean> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.subscribers.add(email);
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Newsletter subscription write error. Forcing local sandbox execution.', e.message);
        }
      }
      
      if (!dbState.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        dbState.subscribers.push({
          id: `sub-${Date.now()}`,
          email,
          date: new Date().toISOString()
        });
        saveLocalDb();
        return true;
      }
      return false;
    }
  },

  logs: {
    getAll: async (): Promise<ActivityLog[]> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.logs.getAll();
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Audit logs fetch error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.logs;
    },
    
    add: async (action: string, details: string, ip?: string): Promise<void> => {
      // Add locally
      dbState.logs.push({
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        action,
        details,
        ip,
        timestamp: new Date().toISOString()
      });
      if (dbState.logs.length > 300) {
        dbState.logs.shift();
      }
      saveLocalDb();

      // Mirror to Supabase if operational
      if (isSupabaseConfigured()) {
        supabaseDb.logs.add(action, details, ip).catch(() => {});
      }
    }
  },

  admins: {
    getByEmail: async (email: string): Promise<any | null> => {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseDb.admins.getByEmail(email);
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Admin credentials select error. Redirecting to local db.json', e.message);
        }
      }
      return dbState.admins.find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
    },
    
    save: async (admin: any): Promise<void> => {
      if (isSupabaseConfigured()) {
        try {
          await supabaseDb.admins.save(admin);
          return;
        } catch (e: any) {
          console.warn('[Supabase Fallback Handler] Admin update error. Synchronizing local fallback node.', e.message);
        }
      }
      
      const idx = dbState.admins.findIndex(a => a.email.toLowerCase() === admin.email.toLowerCase());
      if (idx >= 0) {
        dbState.admins[idx] = admin;
      } else {
        dbState.admins.push(admin);
      }
      saveLocalDb();
    }
  }
};
