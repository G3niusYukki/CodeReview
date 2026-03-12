import { apiClient } from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  plan: 'free' | 'basic' | 'pro' | 'team';
  reviewsLimit: number;
  reviewsUsed: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', { email, password });
  },

  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', { email, password, username });
  },

  async verifyOAuth(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>('/auth/verify');
  },

  async getProfile(): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>('/user/profile');
  },

  async updateProfile(data: { username?: string; language?: string }): Promise<{ message: string; user: User }> {
    return apiClient.put<{ message: string; user: User }>('/user/profile', data);
  }
};
