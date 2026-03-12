require('dotenv').config();
const sequelize = require('./src/config/database');

// 导入队列处理器
require('./src/queues/reviewProcessor');

console.log('Worker started, waiting for jobs...');

// 保持进程运行
process.on('SIGTERM', async () => {
  console.log('Worker shutting down...');
  await sequelize.close();
  process.exit(0);
});
