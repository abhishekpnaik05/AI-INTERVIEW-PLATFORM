import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(payload: RegisterData) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
};
