import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  sanctioned_load_kw?: number;
  address?: string;
  consumer_number?: string;
  previous_month_bill?: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  sanctioned_load_kw?: number;
  address?: string;
  consumer_number?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login-json', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePreviousMonthBill: async (billAmount: number): Promise<{message: string, amount: number}> => {
    const response = await api.put('/auth/update-previous-bill', null, {
      params: { bill_amount: billAmount }
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },
};

export default api;