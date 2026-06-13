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

// Global API endpoints
export const api = {
  properties: {
    list: async (): Promise<Property[]> => {
      try {
        const res = await fetch(`${API_BASE}/properties`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        // Fallback to static data if empty
        return data && data.length > 0 ? data : PROPERTIES_DATA;
      } catch (err) {
        console.warn('Backend properties fetch failed, using fallback seed data.', err);
        return PROPERTIES_DATA;
      }
    },
    get: async (id: string): Promise<Property | null> => {
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`);
        if (!res.ok) throw new Error('API failed');
        return await res.json();
      } catch (err) {
        console.warn('Backend property fetch failed, using fallback list match.', err);
        return PROPERTIES_DATA.find(p => p.id === id) || null;
      }
    },
    create: async (token: string, prop: Omit<Property, 'id' | 'agent'> & { images?: string[] }): Promise<Property> => {
      const res = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prop)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to register property.');
      }
      return await res.json();
    },
    update: async (token: string, id: string, prop: Partial<Property>): Promise<Property> => {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prop)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update property details.');
      }
      return await res.json();
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete property.');
      }
      return true;
    }
  },

  inquiries: {
    submit: async (inquiry: Omit<Inquiry, 'id' | 'date'>): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inquiry)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit inquiry lead.');
      }
      return true;
    },
    list: async (token: string): Promise<Inquiry[]> => {
      const res = await fetch(`${API_BASE}/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Inquiries query failed.');
      return await res.json();
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete inquiry.');
      return true;
    }
  },

  newsletter: {
    subscribe: async (email: string): Promise<string> => {
      const res = await fetch(`${API_BASE}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Newsletter subscription failed.');
      return data.message;
    },
    list: async (token: string): Promise<{ id: string; email: string; date: string }[]> => {
      const res = await fetch(`${API_BASE}/newsletter`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Subscribers query failed.');
      return await res.json();
    }
  },

  analytics: {
    get: async (token: string): Promise<any> => {
      const res = await fetch(`${API_BASE}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Analytics retrieval failed.');
      return await res.json();
    },
    logs: async (token: string): Promise<any[]> => {
      const res = await fetch(`${API_BASE}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Audit logs query failed.');
      return await res.json();
    }
  },

  testimonials: {
    list: async (): Promise<Testimonial[]> => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return TESTIMONIALS_DATA;
      }
    },
    create: async (token: string, test: Omit<Testimonial, 'id' | 'date'>): Promise<Testimonial> => {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(test)
      });
      if (!res.ok) throw new Error('Testimonial addition failed');
      return await res.json();
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return true;
    }
  }
};
