const Queue = require('bull');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
};

// 代码审查任务队列
const reviewQueue = new Queue('code-review', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: 50
  }
});

// 事件监听
reviewQueue.on('completed', (job, result) => {
  console.log(`Review job ${job.id} completed`);
});

reviewQueue.on('failed', (job, err) => {
  console.error(`Review job ${job.id} failed:`, err.message);
});

module.exports = { reviewQueue };
