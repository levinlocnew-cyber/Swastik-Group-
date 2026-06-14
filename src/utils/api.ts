import { Property, Inquiry, Testimonial } from '../types';
import { PROPERTIES_DATA, TESTIMONIALS_DATA } from '../data';

const API_BASE = '/api';

// Simple token utility
export function getSavedToken(): string | null {
  try {
    return localStorage.getItem('swastik_admin_token');
  } catch (e) {
    return null;
  }
}

export function saveToken(token: string) {
  try {
    localStorage.setItem('swastik_admin_token', token);
  } catch (e) {
    // Silently ignore
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('swastik_admin_token');
  } catch (e) {
    // Silently ignore
  }
}

// Local storage mock helpers for standalone/sandbox fallback mode
export function getLocalCollection<T>(key: string, initialData: T[]): T[] {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(val);
  } catch (e) {
    return initialData;
  }
}

export function saveLocalCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Silently ignore
  }
}

/**
 * Safely processes and parses an HTTP Response.
 * Prevents throwing SyntaxErrors when the backend returns HTML error fallbacks.
 */
async function handleResponse(res: Response, fallbackError: string): Promise<any> {
  const contentType = res.headers.get('content-type');
  let data: any = {};
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch (err) {
      data = { error: 'Failed to process JSON stream.' };
    }
  } else {
    try {
      const text = await res.text();
      data = { error: text || `HTTP Status Error ${res.status}` };
    } catch (err) {
      data = { error: `HTTP Response Status ${res.status}: ${res.statusText}` };
    }
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(data.error || 'Auth session expired or token is invalid. Please login again.');
    }
    throw new Error(data.error || fallbackError);
  }

  return data;
}

// Global API endpoints
export const api = {
  properties: {
    list: async (): Promise<Property[]> => {
      try {
        const res = await fetch(`${API_BASE}/properties`);
        const data = await handleResponse(res, 'Fail to query properties compilation.');
        const list = data && data.length > 0 ? data : PROPERTIES_DATA;
        saveLocalCollection("swastik_fallback_properties", list);
        return list;
      } catch (err) {
        console.warn('Backend properties fetch failed, using fallback client storage.', err);
        return getLocalCollection("swastik_fallback_properties", PROPERTIES_DATA);
      }
    },
    get: async (id: string): Promise<Property | null> => {
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`);
        return await handleResponse(res, 'Fail to query property profile details.');
      } catch (err) {
        console.warn('Backend property fetch failed, searching fallback client storage.', err);
        const list = getLocalCollection("swastik_fallback_properties", PROPERTIES_DATA);
        return list.find(p => p.id === id) || null;
      }
    },
    create: async (token: string, prop: Omit<Property, 'id' | 'agent'> & { images?: string[] }): Promise<Property> => {
      try {
        const res = await fetch(`${API_BASE}/properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(prop)
        });
        return await handleResponse(res, 'Failed to register property.');
      } catch (err) {
        console.warn('Backend create property failed, writing directly to client sandbox storage.', err);
        const list = getLocalCollection("swastik_fallback_properties", PROPERTIES_DATA);
        const priceInCrOrLacs = prop.price >= 10000000 
          ? `₹${(prop.price / 10000000).toFixed(2)} Cr` 
          : `₹${(prop.price / 100000).toFixed(2)} Lac`;
        
        const newProp: Property = {
          ...prop,
          id: `prop-${Date.now()}`,
          priceFormatted: priceInCrOrLacs,
          bedrooms: prop.bedrooms !== undefined ? Number(prop.bedrooms) : undefined,
          bathrooms: prop.bathrooms !== undefined ? Number(prop.bathrooms) : undefined,
          agent: {
            name: 'Anmol Sharma',
            role: 'Lucknow Operator Director',
            phone: '+91 89532 11182',
            email: 'amit@swastikgrouplko.com',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
          }
        } as Property;

        list.unshift(newProp);
        saveLocalCollection("swastik_fallback_properties", list);
        
        try {
          const logs = getLocalCollection<any>("swastik_fallback_logs", []);
          logs.unshift({
            id: `log-${Date.now()}`,
            action: 'PROPERTY_CREATED',
            details: `Successfully registered property "${newProp.name}" in Local Sandbox`,
            ip: 'Localhost',
            date: new Date().toISOString()
          });
          saveLocalCollection("swastik_fallback_logs", logs);
        } catch (lErr) {}

        return newProp;
      }
    },
    update: async (token: string, id: string, prop: Partial<Property>): Promise<Property> => {
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(prop)
        });
        return await handleResponse(res, 'Failed to update property details.');
      } catch (err) {
        console.warn('Backend update properties failed, updating local client sandbox storage.', err);
        const list = getLocalCollection("swastik_fallback_properties", PROPERTIES_DATA);
        const index = list.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error('Property to update not found in local client storage.');
        }
        const current = list[index];
        const priceInCrOrLacs = prop.price 
          ? (prop.price >= 10000000 ? `₹${(prop.price / 10000000).toFixed(2)} Cr` : `₹${(prop.price / 100000).toFixed(2)} Lac`)
          : current.priceFormatted;

        const updated: Property = {
          ...current,
          ...prop,
          priceFormatted: priceInCrOrLacs,
          bedrooms: prop.bedrooms !== undefined ? Number(prop.bedrooms) : current.bedrooms,
          bathrooms: prop.bathrooms !== undefined ? Number(prop.bathrooms) : current.bathrooms,
        } as Property;

        list[index] = updated;
        saveLocalCollection("swastik_fallback_properties", list);

        try {
          const logs = getLocalCollection<any>("swastik_fallback_logs", []);
          logs.unshift({
            id: `log-${Date.now()}`,
            action: 'PROPERTY_UPDATED',
            details: `Modified property details for "${updated.name}" in Local Sandbox`,
            ip: 'Localhost',
            date: new Date().toISOString()
          });
          saveLocalCollection("swastik_fallback_logs", logs);
        } catch (lErr) {}

        return updated;
      }
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        await handleResponse(res, 'Failed to delete property.');
        return true;
      } catch (err) {
        console.warn('Backend delete properties failed, removing from local client sandbox storage.', err);
        let list = getLocalCollection("swastik_fallback_properties", PROPERTIES_DATA);
        const target = list.find(p => p.id === id);
        list = list.filter(p => p.id !== id);
        saveLocalCollection("swastik_fallback_properties", list);

        try {
          const logs = getLocalCollection<any>("swastik_fallback_logs", []);
          logs.unshift({
            id: `log-${Date.now()}`,
            action: 'PROPERTY_DELETED',
            details: `Removed property "${target?.name || id}" from Local Sandbox`,
            ip: 'Localhost',
            date: new Date().toISOString()
          });
          saveLocalCollection("swastik_fallback_logs", logs);
        } catch (lErr) {}

        return true;
      }
    }
  },

  inquiries: {
    submit: async (inquiry: Omit<Inquiry, 'id' | 'date'>): Promise<boolean> => {
      try {
        const res = await fetch(`${API_BASE}/inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(inquiry)
        });
        await handleResponse(res, 'Failed to submit inquiry lead.');
        return true;
      } catch (err) {
        console.warn('Backend submit inquiry failed, storing directly in local sandbox storage.', err);
        const list = getLocalCollection<Inquiry>("swastik_fallback_inquiries", []);
        const newInquiry: Inquiry = {
          ...inquiry,
          id: `inq-${Date.now()}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        list.unshift(newInquiry);
        saveLocalCollection("swastik_fallback_inquiries", list);

        try {
          const logs = getLocalCollection<any>("swastik_fallback_logs", []);
          logs.unshift({
            id: `log-${Date.now()}`,
            action: 'LEAD_GENERATED',
            details: `New inbound inquiry from ${newInquiry.name} (${newInquiry.phone}) on ${newInquiry.propertyName || 'General Inquiry'}`,
            ip: 'User IP',
            date: new Date().toISOString()
          });
          saveLocalCollection("swastik_fallback_logs", logs);
        } catch (lErr) {}

        return true;
      }
    },
    list: async (token: string): Promise<Inquiry[]> => {
      try {
        const res = await fetch(`${API_BASE}/inquiries`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return await handleResponse(res, 'Inquiries query failed.');
      } catch (err) {
        console.warn('Backend inquiries query failed, reading local client sandbox storage.', err);
        return getLocalCollection<Inquiry>("swastik_fallback_inquiries", []);
      }
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      try {
        const res = await fetch(`${API_BASE}/inquiries/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        await handleResponse(res, 'Failed to delete inquiry.');
        return true;
      } catch (err) {
        console.warn('Backend inquiry deletion failed, deleting from local client sandbox storage.', err);
        let list = getLocalCollection<Inquiry>("swastik_fallback_inquiries", []);
        list = list.filter(inq => inq.id !== id);
        saveLocalCollection("swastik_fallback_inquiries", list);
        return true;
      }
    }
  },

  newsletter: {
    subscribe: async (email: string): Promise<string> => {
      try {
        const res = await fetch(`${API_BASE}/newsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const data = await handleResponse(res, 'Newsletter subscription failed.');
        return data.message;
      } catch (err) {
        console.warn('Backend subscription failed, saving locally in sandbox storage.', err);
        const list = getLocalCollection<{ id: string; email: string; date: string }>("swastik_fallback_subscribers", []);
        if (list.some(s => s.email.toLowerCase() === email.toLowerCase())) {
          return 'Your email is already registered on our list.';
        }
        list.unshift({
          id: `sub-${Date.now()}`,
          email,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        saveLocalCollection("swastik_fallback_subscribers", list);

        try {
          const logs = getLocalCollection<any>("swastik_fallback_logs", []);
          logs.unshift({
            id: `log-${Date.now()}`,
            action: 'NEWSLETTER_SUBSCRIBED',
            details: `New digital operator subscriber registered: ${email}`,
            ip: 'Localhost',
            date: new Date().toISOString()
          });
          saveLocalCollection("swastik_fallback_logs", logs);
        } catch (lErr) {}

        return 'Thank you for subscribing to our newsletters!';
      }
    },
    list: async (token: string): Promise<{ id: string; email: string; date: string }[]> => {
      try {
        const res = await fetch(`${API_BASE}/newsletter`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return await handleResponse(res, 'Subscribers query failed.');
      } catch (err) {
        console.warn('Backend subscribers list failed, loading from local sandbox storage.', err);
        return getLocalCollection<{ id: string; email: string; date: string }>("swastik_fallback_subscribers", []);
      }
    }
  },

  analytics: {
    get: async (token: string): Promise<any> => {
      try {
        const res = await fetch(`${API_BASE}/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return await handleResponse(res, 'Analytics retrieval failed.');
      } catch (err) {
        console.warn('Backend analytics retrieval failed, calculating locally on sandbox storage.', err);
        const properties = getLocalCollection("swastik_fallback_properties", PROPERTIES_DATA);
        const inquiries = getLocalCollection<Inquiry>("swastik_fallback_inquiries", []);
        const subscribers = getLocalCollection<any>("swastik_fallback_subscribers", []);

        // Compute realistic dynamic metrics
        const resBuy = properties.filter(p => p.type === 'buy');
        const totalValue = resBuy.reduce((sum, p) => sum + p.price, 0);

        // Generate clean mock leads trend
        const trendDays = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return {
            day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
            leads: inquiries.length > 0 ? Math.floor(inquiries.length / 4) + (i % 2) : i % 3 + 1,
            subscribers: subscribers.length > 0 ? Math.floor(subscribers.length / 5) + (i % 2) : i % 2
          };
        }).reverse();

        return {
          stats: {
            totalProperties: properties.length,
            featuredProperties: properties.filter(p => p.featured).length,
            activeLeads: inquiries.length,
            totalSubscribers: subscribers.length,
            portfolioValue: totalValue >= 100000000 
              ? `₹${(totalValue / 100000000).toFixed(2)} Cr Portfolio` 
              : `₹${(totalValue / 10000000).toFixed(2)} Cr Portfolio`
          },
          chartsByLocality: Array.from(new Set(properties.map(p => p.location))).map((loc) => ({
            name: loc,
            count: properties.filter(p => p.location === loc).length
          })),
          leadsTrend: trendDays
        };
      }
    },
    logs: async (token: string): Promise<any[]> => {
      try {
        const res = await fetch(`${API_BASE}/logs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return await handleResponse(res, 'Audit logs query failed.');
      } catch (err) {
        console.warn('Backend audit logs failed, loading from local sandbox storage.', err);
        return getLocalCollection<any>("swastik_fallback_logs", [
          { id: 'log-1', action: 'SYSTEM_BOOT', details: 'Vite app launched in client sandbox mode', ip: '127.0.0.1', date: new Date().toISOString() }
        ]);
      }
    }
  },

  testimonials: {
    list: async (): Promise<Testimonial[]> => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await handleResponse(res, 'Failed to query reviews.');
        saveLocalCollection("swastik_fallback_testimonials", data);
        return data;
      } catch {
        return getLocalCollection("swastik_fallback_testimonials", TESTIMONIALS_DATA);
      }
    },
    create: async (token: string, test: Omit<Testimonial, 'id' | 'date'>): Promise<Testimonial> => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(test)
        });
        return await handleResponse(res, 'Testimonial addition failed');
      } catch (err) {
        console.warn('Backend testimonial addition failed, writing to client local storage.', err);
        const list = getLocalCollection("swastik_fallback_testimonials", TESTIMONIALS_DATA);
        const newTest: Testimonial = {
          ...test,
          id: `test-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        list.unshift(newTest);
        saveLocalCollection("swastik_fallback_testimonials", list);
        return newTest;
      }
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      try {
        await fetch(`${API_BASE}/testimonials/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return true;
      } catch {
        let list = getLocalCollection("swastik_fallback_testimonials", TESTIMONIALS_DATA);
        list = list.filter(t => t.id !== id);
        saveLocalCollection("swastik_fallback_testimonials", list);
        return true;
      }
    }
  },

  supabase: {
    status: async (): Promise<{ configured: boolean; url: string | null }> => {
      try {
        const res = await fetch(`${API_BASE}/supabase-status`);
        return await handleResponse(res, 'Failed to query Supabase status.');
      } catch {
        return { configured: false, url: null };
      }
    }
  }
};
