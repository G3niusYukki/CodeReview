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

declare module './middleware/rateLimiter' {
  import { RequestHandler } from 'express';
  export const authLimiter: RequestHandler;
  export const apiLimiter: RequestHandler;
  export const strictLimiter: RequestHandler;
}
