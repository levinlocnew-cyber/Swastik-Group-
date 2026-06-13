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
      // Throw clear auth error so client-side handlers can automatically redirect/log out
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
        return data && data.length > 0 ? data : PROPERTIES_DATA;
      } catch (err) {
        console.warn('Backend properties fetch failed, using fallback seed data.', err);
        return PROPERTIES_DATA;
      }
    },
    get: async (id: string): Promise<Property | null> => {
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`);
        return await handleResponse(res, 'Fail to query property profile details.');
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
      return await handleResponse(res, 'Failed to register property.');
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
      return await handleResponse(res, 'Failed to update property details.');
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await handleResponse(res, 'Failed to delete property.');
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
      await handleResponse(res, 'Failed to submit inquiry lead.');
      return true;
    },
    list: async (token: string): Promise<Inquiry[]> => {
      const res = await fetch(`${API_BASE}/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await handleResponse(res, 'Inquiries query failed.');
    },
    delete: async (token: string, id: string): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await handleResponse(res, 'Failed to delete inquiry.');
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
      const data = await handleResponse(res, 'Newsletter subscription failed.');
      return data.message;
    },
    list: async (token: string): Promise<{ id: string; email: string; date: string }[]> => {
      const res = await fetch(`${API_BASE}/newsletter`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await handleResponse(res, 'Subscribers query failed.');
    }
  },

  analytics: {
    get: async (token: string): Promise<any> => {
      const res = await fetch(`${API_BASE}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await handleResponse(res, 'Analytics retrieval failed.');
    },
    logs: async (token: string): Promise<any[]> => {
      const res = await fetch(`${API_BASE}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await handleResponse(res, 'Audit logs query failed.');
    }
  },

  testimonials: {
    list: async (): Promise<Testimonial[]> => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        return await handleResponse(res, 'Failed to query reviews.');
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
      return await handleResponse(res, 'Testimonial addition failed');
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
