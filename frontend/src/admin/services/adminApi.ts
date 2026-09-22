const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; message?: string }> {
  const token = localStorage.getItem('krishi_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `HTTP Error ${response.status}`);
    }

    return json;
  } catch (error: any) {
    console.error(`Admin API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const adminApi = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      adminRequest<{ admin: any; token: string }>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    getMe: () => adminRequest<any>('/admin/auth/me')
  },

  stats: {
    get: () => adminRequest<any>('/admin/stats')
  },

  pages: {
    getAll: () => adminRequest<any[]>('/admin/pages'),
    getById: (id: string) => adminRequest<any>(`/admin/pages/${id}`),
    save: (id: string, pageData: any) =>
      adminRequest<any>(`/admin/pages/${id}`, {
        method: 'POST',
        body: JSON.stringify(pageData)
      }),
    publish: (id: string) =>
      adminRequest<any>(`/admin/pages/${id}/publish`, { method: 'POST' }),
    duplicate: (id: string) =>
      adminRequest<any>(`/admin/pages/${id}/duplicate`, { method: 'POST' }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/pages/${id}`, { method: 'DELETE' })
  },

  dashboard: {
    get: () => adminRequest<any>('/admin/dashboard'),
    update: (config: any) =>
      adminRequest<any>('/admin/dashboard', {
        method: 'PUT',
        body: JSON.stringify(config)
      })
  },

  crops: {
    getAll: (params?: { search?: string; category?: string; status?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return adminRequest<any[]>(`/admin/crops${q ? `?${q}` : ''}`);
    },
    create: (data: any) =>
      adminRequest<any>('/admin/crops', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/crops/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/crops/${id}`, { method: 'DELETE' })
  },

  market: {
    getAll: () => adminRequest<any[]>('/admin/market'),
    create: (data: any) =>
      adminRequest<any>('/admin/market', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/market/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/market/${id}`, { method: 'DELETE' })
  },

  schemes: {
    getAll: () => adminRequest<any[]>('/admin/schemes'),
    create: (data: any) =>
      adminRequest<any>('/admin/schemes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/schemes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/schemes/${id}`, { method: 'DELETE' })
  },

  weather: {
    get: () => adminRequest<{ weather: any; advisories: any[] }>('/admin/weather'),
    createAdvisory: (data: any) =>
      adminRequest<any>('/admin/weather', { method: 'POST', body: JSON.stringify(data) }),
    updateAdvisory: (id: string, data: any) =>
      adminRequest<any>(`/admin/weather/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAdvisory: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/weather/${id}`, { method: 'DELETE' })
  },

  aiAdvisor: {
    getAll: () => adminRequest<any[]>('/admin/ai-advisor'),
    create: (data: any) =>
      adminRequest<any>('/admin/ai-advisor', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/ai-advisor/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/ai-advisor/${id}`, { method: 'DELETE' })
  },

  drone: {
    getAll: () => adminRequest<{ services: any[]; plans: any[] }>('/admin/drone'),
    createService: (data: any) =>
      adminRequest<any>('/admin/drone', { method: 'POST', body: JSON.stringify(data) }),
    updateService: (id: string, data: any) =>
      adminRequest<any>(`/admin/drone/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteService: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/drone/${id}`, { method: 'DELETE' })
  },

  iot: {
    getAll: () => adminRequest<any[]>('/admin/iot'),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/iot/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  smartPump: {
    get: () => adminRequest<any>('/admin/smart-pump'),
    update: (data: any) =>
      adminRequest<any>('/admin/smart-pump', { method: 'PUT', body: JSON.stringify(data) })
  },

  store: {
    getAll: () => adminRequest<any[]>('/admin/store'),
    create: (data: any) =>
      adminRequest<any>('/admin/store', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/store/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/store/${id}`, { method: 'DELETE' })
  },

  media: {
    getAll: () => adminRequest<any[]>('/admin/media'),
    upload: (data: any) =>
      adminRequest<any>('/admin/media', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/media/${id}`, { method: 'DELETE' })
  },

  users: {
    getAll: () => adminRequest<any[]>('/admin/users'),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  notifications: {
    getAll: () => adminRequest<any[]>('/admin/notifications'),
    create: (data: any) =>
      adminRequest<any>('/admin/notifications', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/notifications/${id}`, { method: 'DELETE' })
  },

  settings: {
    get: () => adminRequest<any>('/admin/settings'),
    update: (data: any) =>
      adminRequest<any>('/admin/settings', { method: 'PUT', body: JSON.stringify(data) })
  },

  adminUsers: {
    getAll: () => adminRequest<any[]>('/admin/admin-users'),
    create: (data: any) =>
      adminRequest<any>('/admin/admin-users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      adminRequest<any>(`/admin/admin-users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminRequest<{ deleted: boolean }>(`/admin/admin-users/${id}`, { method: 'DELETE' })
  },

  activity: {
    getAll: () => adminRequest<any[]>('/admin/activity')
  },

  // Public CMS endpoints for farmer app
  cms: {
    getDashboard: async () => {
      try {
        const res = await fetch(`${API_BASE}/cms/dashboard`);
        return await res.json();
      } catch (e) {
        return null;
      }
    },
    getPage: async (slug: string) => {
      try {
        const res = await fetch(`${API_BASE}/cms/pages/${slug}`);
        return await res.json();
      } catch (e) {
        return null;
      }
    },
    getSettings: async () => {
      try {
        const res = await fetch(`${API_BASE}/cms/settings`);
        return await res.json();
      } catch (e) {
        return null;
      }
    }
  }
};
