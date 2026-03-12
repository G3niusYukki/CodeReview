import { apiClient } from './api';

export interface Review {
  id: number;
  fileName?: string;
  language: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  repository?: string;
  issuesFound: number;
  securityIssues: number;
  performanceIssues: number;
  bestPracticeIssues: number;
  processingTime?: number;
  createdAt: string;
}

export interface ReviewDetail extends Review {
  codeContent: string;
  result?: Array<{
    type: string;
    description: string;
    line: number | null;
    severity: 'high' | 'medium' | 'low';
  }>;
  summary?: string;
  errorMessage?: string;
}

export interface CreateReviewData {
  code: string;
  language: string;
  fileName?: string;
  repository?: string;
  branch?: string;
}

export const reviewService = {
  async create(data: CreateReviewData): Promise<{ message: string; reviewId: number; status: string }> {
    return apiClient.post<{ message: string; reviewId: number; status: string }>('/review/analyze', data);
  },

  async getStatus(id: number): Promise<ReviewDetail> {
    return apiClient.get<ReviewDetail>(`/review/status/${id}`);
  },

  async getHistory(page = 1, limit = 20): Promise<{ reviews: Review[]; pagination: { total: number; pages: number } }> {
    return apiClient.get<{ reviews: Review[]; pagination: { total: number; pages: number } }>('/review/history', { page, limit });
  },

  async getById(id: number): Promise<ReviewDetail> {
    return apiClient.get<ReviewDetail>(`/review/${id}`);
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/review/${id}`);
  }
};
