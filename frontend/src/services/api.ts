import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  User,
  Application,
  Certificate,
  RegisterPayload,
  LoginPayload,
  DashboardStats,
} from '../types';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach Token ───────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: RegisterPayload) =>
    api.post<ApiResponse<{ user: User }>>('/auth/register', data),

  login: (data: LoginPayload) =>
    api.post<ApiResponse<{ user: User }>>('/auth/login', data),

  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),

  updateProfile: (data: Partial<Pick<User, 'fullName' | 'phone' | 'address' | 'citizenshipNumber'>>) =>
    api.put<ApiResponse<{ user: User }>>('/auth/update-profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>('/auth/change-password', data),
};

// ─── Application API ──────────────────────────────────────────────────────────
export const applicationAPI = {
  create: (data: Partial<Application>) =>
    api.post<ApiResponse<{ application: Application }>>('/applications', data),

  getAll: (params?: { status?: string; certificateType?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{
      applications: Application[];
      total: number;
      page: number;
      totalPages: number;
      pagination?: unknown;
    }>>('/applications', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<{ application: Application }>>(`/applications/${id}`),

  update: (id: string, data: Partial<Application>) =>
    api.put<ApiResponse<{ application: Application }>>(`/applications/${id}`, data),

  deleteApp: (id: string) =>
    api.delete<ApiResponse>(`/applications/${id}`),

  uploadDocument: (id: string, formData: FormData) =>
    api.post<ApiResponse<{ application: Application }>>(`/applications/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  getAllApplications: (params?: {
    status?: string;
    certificateType?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<ApiResponse<{ applications: Application[]; pagination: unknown }>>(
      '/applications/admin/all-applications',
      { params }
    ),

  approveApplication: (id: string, data?: { adminRemarks?: string }) =>
    api.put<ApiResponse<{ application: Application; certificate: Certificate }>>(
      `/applications/admin/applications/${id}/approve`,
      data
    ),

  rejectApplication: (id: string, data: { rejectionReason: string; adminRemarks?: string }) =>
    api.put<ApiResponse<{ application: Application }>>(
      `/applications/admin/applications/${id}/reject`,
      data
    ),

  getStats: () =>
    api.get<ApiResponse<{ stats: DashboardStats; totalUsers: number; totalCerts: number }>>(
      '/applications/admin/stats'
    ),

  getAllUsers: (params?: { role?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ users: User[]; pagination: unknown }>>(
      '/applications/admin/users',
      { params }
    ),
};

// ─── Certificate API ──────────────────────────────────────────────────────────
export const certificateAPI = {
  getAll: () =>
    api.get<ApiResponse<{ certificates: Certificate[] }>>('/applications/certificates/my'),

  download: (certNumber: string) =>
    api.get(`/certificates/${certNumber}/download`, { responseType: 'blob' }),

  verify: (certNumber: string) =>
    api.get<ApiResponse<{ certificate: Certificate; isExpired: boolean; status: string }>>(
      `/applications/certificates/verify/${certNumber}`
    ),
};

export default api;
