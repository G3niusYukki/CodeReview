const rateLimit = require('express-rate-limit');

// 认证端点限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 每个 IP 最多 5 次尝试
  message: {
    error: 'Too many login attempts',
    message: 'Please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// API 通用限制
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: (req) => {
    // 根据用户等级调整限制
    if (req.user?.plan === 'pro' || req.user?.plan === 'team') {
      return 200; // Pro/Team 用户每分钟 200 次
    }
    if (req.user?.plan === 'basic') {
      return 100; // Basic 用户每分钟 100 次
    }
    return 60; // 免费用户每分钟 60 次
  },
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 严格限制（用于审查提交等昂贵操作）
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 10,
  message: {
    error: 'Rate limit exceeded',
    message: 'Please wait before submitting another review'
  }
});

module.exports = {
  authLimiter,
  apiLimiter,
  strictLimiter
};
