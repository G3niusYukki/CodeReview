import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password?: string;
  githubId?: string;
  username: string;
  avatar?: string;
  plan: 'free' | 'basic' | 'pro' | 'team';
  reviewsLimit: number;
  reviewsUsed: number;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  currentPeriodEnd?: Date;
  language: 'zh' | 'en';
  isActive: boolean;
  githubAccessToken?: string;
}

export interface Review {
  id: number;
  userId: number;
  repository?: string;
  branch?: string;
  commitHash?: string;
  fileName?: string;
  codeContent: string;
  language: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: Array<{
    type: string;
    description: string;
    line: number | null;
    severity: 'high' | 'medium' | 'low';
  }>;
  summary?: string;
  issuesFound: number;
  securityIssues: number;
  performanceIssues: number;
  bestPracticeIssues: number;
  processingTime?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user: User;
  token: string;
}

export interface PlanConfig {
  limit: number;
  price: number;
  name: string;
}

export type PlanType = 'free' | 'basic' | 'pro' | 'team';
