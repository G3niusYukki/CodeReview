import { apiClient } from './api';

export interface AIProvider {
  id: number;
  name: string;
  displayName: string;
  providerType: 'openai' | 'anthropic' | 'google' | 'openai-compatible' | 'custom';
  defaultModel: string;
  availableModels: string[];
  description?: string;
}

export interface AIProviderDetail extends AIProvider {
  apiEndpoint: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  rateLimitRPM: number;
}

export interface CreateProviderData {
  name: string;
  displayName: string;
  providerType: string;
  apiEndpoint: string;
  apiKey?: string;
  defaultModel: string;
  availableModels?: string[];
  headers?: Record<string, string>;
  config?: {
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
    supportsJsonMode?: boolean;
    authType?: 'bearer' | 'x-api-key';
  };
  priority?: number;
  rateLimitRPM?: number;
  description?: string;
}

export const providerService = {
  async getAll(): Promise<{ providers: AIProvider[] }> {
    return apiClient.get<{ providers: AIProvider[] }>('/providers');
  },

  async getAdmin(): Promise<{ providers: AIProviderDetail[] }> {
    return apiClient.get<{ providers: AIProviderDetail[] }>('/providers/admin');
  },

  async create(data: CreateProviderData): Promise<{ message: string; provider: AIProviderDetail }> {
    return apiClient.post<{ message: string; provider: AIProviderDetail }>('/providers', data);
  },

  async update(id: number, data: Partial<CreateProviderData>): Promise<{ message: string; provider: AIProviderDetail }> {
    return apiClient.put<{ message: string; provider: AIProviderDetail }>(`/providers/${id}`, data);
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/providers/${id}`);
  },

  async test(id: number): Promise<{ success: boolean; latency: number; provider: string; result: any }> {
    return apiClient.post<{ success: boolean; latency: number; provider: string; result: any }>(`/providers/${id}/test`);
  },

  async getStatus(): Promise<{ statuses: Array<{ name: string; status: string; latency?: number; error?: string }> }> {
    return apiClient.get<{ statuses: Array<{ name: string; status: string; latency?: number; error?: string }> }>('/providers/status');
  },

  async setDefault(id: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/providers/${id}/set-default`);
  }
};
