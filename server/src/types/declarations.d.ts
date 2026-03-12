declare module '*.js' {
  const content: any;
  export default content;
}

declare module './config/database' {
  import { Sequelize } from 'sequelize';
  const sequelize: Sequelize;
  export default sequelize;
}

declare module './routes/auth' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/user' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/review' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/github' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/payment' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/team' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/webhook' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/provider' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './middleware/rateLimiter' {
  import { RequestHandler } from 'express';
  export const authLimiter: RequestHandler;
  export const apiLimiter: RequestHandler;
  export const strictLimiter: RequestHandler;
}

declare module './services/codeReviewService' {
  export const reviewCode: (code: string, language: string, options?: any) => Promise<any>;
  export const PLAN_CONFIGS: any;
  export class CodeReviewService {
    providers: Map<string, any>;
    defaultProvider: any;
    loadProviders(): Promise<void>;
    reviewCode(code: string, language: string, options?: any): Promise<any>;
  }
  export const codeReviewService: CodeReviewService;
}
