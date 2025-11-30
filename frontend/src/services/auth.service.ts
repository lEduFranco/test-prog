import { api } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/user';
import { storage } from '@/utils/storage';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { access_token, refresh_token, user } = response.data;
    storage.setAuth(access_token, refresh_token, user);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { access_token, refresh_token, user } = response.data;
    storage.setAuth(access_token, refresh_token, user);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    storage.setUser(response.data);
    return response.data;
  },

  logout(): void {
    storage.clearAuth();
  },

  getCurrentUser(): User | null {
    return storage.getUser();
  },

  isAuthenticated(): boolean {
    return !!storage.getAccessToken();
  },
};
