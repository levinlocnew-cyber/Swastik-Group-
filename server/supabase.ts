import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, Testimonial, Inquiry } from '../src/types';
import { ActivityLog, NewsletterSubscriber } from './db';

// Lazy-loaded Supabase client instance
let supabaseInstance: SupabaseClient | null = null;

// Read config environment variables safely
const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function isSupabaseConfigured(): boolean {
  return !!(url && key);
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      console.log('✓ Supabase Client initialized successfully.');
    } catch (err: any) {
      console.error('Failed to initialize Supabase connection client:', err?.message || err);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

// ====================================================================
// TRANSFORMERS FOR CASE TRANSLATION (camelCase <-> snake_case)
// ====================================================================

function mapPropToPostgres(p: Property) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    type: p.type,
    price: p.price,
    price_formatted: p.priceFormatted,
    location: p.location,
    address: p.address,
    area: p.area,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    images: p.images,
    featured: p.featured,
    status: p.status,
    description: p.description,
    amenities: p.amenities,
    rera_approved: p.reraApproved,
    rera_number: p.reraNumber,
    agent: p.agent
  };
}

function mapPropFromPostgres(row: any): Property {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    type: row.type,
    price: Number(row.price),
    priceFormatted: row.price_formatted || `₹${row.price}`,
    location: row.location,
    address: row.address,
    area: row.area,
    bedrooms: row.bedrooms ? Number(row.bedrooms) : undefined,
    bathrooms: row.bathrooms ? Number(row.bathrooms) : undefined,
    images: Array.isArray(row.images) ? row.images : [],
    featured: !!row.featured,
    status: row.status || 'Ready to Move',
    description: row.description || '',
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    reraApproved: !!row.rera_approved,
    reraNumber: row.rera_number || '',
    agent: row.agent || {
      name: 'Swastik Group',
      role: 'Official Representative',
      phone: '+91 89532 11182',
      email: 'info@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
    }
  };
}

function mapInquiryToPostgres(inq: Inquiry) {
  return {
    id: inq.id,
    name: inq.name,
    email: inq.email || 'not-provided@swastik.com',
    phone: inq.phone,
    message: inq.message,
    property_id: inq.propertyId,
    property_name: inq.propertyName,
    date: inq.date
  };
}

function mapInquiryFromPostgres(row: any): Inquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    propertyId: row.property_id,
    propertyName: row.property_name,
    date: row.date || new Date(row.created_at).toLocaleDateString('en-IN')
  };
}

function mapLogToPostgres(log: ActivityLog) {
  return {
    id: log.id,
    action: log.action,
    details: log.details,
    ip: log.ip,
    timestamp: log.timestamp
  };
}

function mapLogFromPostgres(row: any): ActivityLog {
  return {
    id: row.id,
    action: row.action,
    details: row.details,
    ip: row.ip,
    timestamp: row.timestamp || row.created_at
  };
}

// ====================================================================
// SUPABASE OPERATIONS IMPLEMENTATION
// ====================================================================

export const supabaseDb = {
  properties: {
    getAll: async (): Promise<Property[]> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return (data || []).map(mapPropFromPostgres);
    },
    
    getById: async (id: string): Promise<Property | null> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      return data ? mapPropFromPostgres(data) : null;
    },
    
    save: async (prop: Property): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const mapped = mapPropToPostgres(prop);
      const { error } = await client
        .from('properties')
        .upsert(mapped, { onConflict: 'id' });
        
      if (error) throw error;
    },
    
    delete: async (id: string): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { error } = await client
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    }
  },

  inquiries: {
    getAll: async (): Promise<Inquiry[]> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return (data || []).map(mapInquiryFromPostgres);
    },
    
    getById: async (id: string): Promise<Inquiry | null> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      return data ? mapInquiryFromPostgres(data) : null;
    },
    
    save: async (inquiry: Inquiry): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const mapped = mapInquiryToPostgres(inquiry);
      const { error } = await client
        .from('inquiries')
        .upsert(mapped, { onConflict: 'id' });
        
      if (error) throw error;
    },
    
    delete: async (id: string): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { error } = await client
        .from('inquiries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    }
  },

  testimonials: {
    getAll: async (): Promise<Testimonial[]> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    
    save: async (testimonial: Testimonial): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { error } = await client
        .from('testimonials')
        .upsert(testimonial, { onConflict: 'id' });
        
      if (error) throw error;
    },
    
    delete: async (id: string): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { error } = await client
        .from('testimonials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    }
  },

  subscribers: {
    getAll: async (): Promise<NewsletterSubscriber[]> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('subscribers')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        email: row.email,
        date: row.date || row.created_at
      }));
    },
    
    add: async (email: string): Promise<boolean> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      // Check if email already exists
      const { data: existing, error: checkError } = await client
        .from('subscribers')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      if (checkError) throw checkError;
      if (existing) return false;
      
      const { error } = await client
        .from('subscribers')
        .insert({
          id: `sub-${Date.now()}`,
          email,
          date: new Date().toISOString()
        });
        
      if (error) throw error;
      return true;
    }
  },

  logs: {
    getAll: async (): Promise<ActivityLog[]> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
        
      if (error) throw error;
      return (data || []).map(mapLogFromPostgres);
    },
    
    add: async (action: string, details: string, ip?: string): Promise<void> => {
      const client = getSupabase();
      if (!client) return; // Silent if no Supabase, caller will write to local instead
      
      const logItem: ActivityLog = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        action,
        details,
        ip,
        timestamp: new Date().toISOString()
      };
      
      const mapped = mapLogToPostgres(logItem);
      const { error } = await client
        .from('logs')
        .insert(mapped);
        
      if (error) {
        console.warn('Silent warning: Failed to commit audit log item to Supabase.', error);
      }
    }
  },

  admins: {
    getByEmail: async (email: string): Promise<any | null> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const { data, error } = await client
        .from('admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      return {
        email: data.email,
        passwordHash: data.password_hash,
        resetToken: data.reset_token,
        resetTokenExpiry: data.reset_token_expiry ? Number(data.reset_token_expiry) : undefined
      };
    },
    
    save: async (admin: any): Promise<void> => {
      const client = getSupabase();
      if (!client) throw new Error('Supabase client unconfigured.');
      
      const mapped = {
        email: admin.email,
        password_hash: admin.passwordHash,
        reset_token: admin.resetToken || null,
        reset_token_expiry: admin.resetTokenExpiry || null
      };
      
      const { error } = await client
        .from('admins')
        .upsert(mapped, { onConflict: 'email' });
        
      if (error) throw error;
    }
  }
};

// ====================================================================
// STORAGE / ASSET UPLOAD - SUPABASE STORAGE BUCKET HANDLER
// ====================================================================

/**
 * Uploads a base64 or binary data string directly into Supabase Storage.
 * @param base64Data The base64 file data string (data:image/jpeg;base64,....)
 * @returns Fully qualified public CDN URL pointer
 */
export async function uploadImageToSupabase(base64Data: string): Promise<string> {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase Storage integration requires SUPABASE_URL & SUPABASE_KEY to be configured.');
  }

  try {
    // 1. Parse content-type and raw buffer
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      if (base64Data.startsWith('http')) {
        return base64Data; // Already a URL
      }
      throw new Error('Invalid base64 payload received.');
    }

    const contentType = matches[1];
    const base64Buffer = Buffer.from(matches[2], 'base64');
    
    // Determine extension
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `property-${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;

    // 2. Transpatch file binary stream to storage bucket "property-images"
    const { error: uploadError } = await client.storage
      .from('property-images')
      .upload(fileName, base64Buffer, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      // If the bucket doesn't exist yet, we can attempt to create it (highly requested)
      if (uploadError.message.includes('bucket not found') || uploadError.message.includes('not found')) {
        console.warn('Storage bucket "property-images" not found, continuing with fallback.');
      }
      throw uploadError;
    }

    // 3. Resolve the public asset lookup link
    const { data: publicUrlData } = client.storage
      .from('property-images')
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Failed to resolve uploaded property public url.');
    }

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('[Supabase Storage Upload Failure]:', err?.message || err);
    throw err;
  }
}
