const { reviewQueue } = require('./reviewQueue');
const Review = require('../models/Review');
const User = require('../models/User');
const { reviewCode } = require('../services/codeReviewService');

// 处理代码审查任务
reviewQueue.process('analyze', 5, async (job) => {
  const { reviewId, code, language, userId, options } = job.data;

  try {
    // 更新任务进度
    await job.progress(10);

    // 执行代码审查
    const result = await reviewCode(code, language, options);
    
    await job.progress(80);

    // 更新审查记录
    await Review.update({
      status: 'completed',
      result: result.issues,
      summary: result.summary,
      issuesFound: result.issuesFound,
      securityIssues: result.securityIssues,
      performanceIssues: result.performanceIssues,
      bestPracticeIssues: result.bestPracticeIssues,
      processingTime: result.processingTime
    }, {
      where: { id: reviewId }
    });

    // 增加用户使用量
    await User.increment('reviewsUsed', {
      where: { id: userId }
    });

    await job.progress(100);

    return {
      success: true,
      reviewId,
      issuesFound: result.issuesFound
    };
  } catch (error) {
    console.error(`Review job ${job.id} failed:`, error);
    
    // 更新审查记录为失败状态
    await Review.update({
      status: 'failed',
      errorMessage: error.message
    }, {
      where: { id: reviewId }
    });

    throw error;
  }
});

module.exports = { reviewQueue };
