const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const { PLAN_CONFIGS } = require('../services/codeReviewService');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        plan: user.plan,
        planName: PLAN_CONFIGS[user.plan].name,
        reviewsLimit: user.reviewsLimit,
        reviewsUsed: user.reviewsUsed,
        reviewsRemaining: user.reviewsLimit - user.reviewsUsed,
        subscriptionStatus: user.subscriptionStatus,
        currentPeriodEnd: user.currentPeriodEnd,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

const validateProfile = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters'),
  body('language')
    .optional()
    .isIn(['zh', 'en'])
    .withMessage('Language must be either zh or en')
];

router.put('/profile', auth, validateProfile, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, language } = req.body;
    const user = req.user;

    if (username) user.username = username;
    if (language) user.language = language;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/usage', auth, async (req, res) => {
  try {
    const user = req.user;
    const usagePercentage = Math.round((user.reviewsUsed / user.reviewsLimit) * 100);

    res.json({
      plan: user.plan,
      reviewsLimit: user.reviewsLimit,
      reviewsUsed: user.reviewsUsed,
      reviewsRemaining: user.reviewsLimit - user.reviewsUsed,
      usagePercentage,
      resetDate: getNextMonthFirstDay()
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to get usage' });
  }
});

function getNextMonthFirstDay() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

router.get('/settings/api', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      hasApiKey: Boolean(user.apiKey),
      apiProvider: user.apiProvider,
      apiEndpoint: user.apiEndpoint,
      apiModel: user.apiModel
    });
  } catch (error) {
    console.error('Get API settings error:', error);
    res.status(500).json({ error: 'Failed to get API settings' });
  }
});

router.put('/settings/api', auth, async (req, res) => {
  try {
    const { apiKey, apiProvider, apiEndpoint, apiModel } = req.body;
    const user = req.user;

    if (apiKey !== undefined) {
      if (apiKey === '') {
        user.apiKey = null;
        user.apiProvider = null;
        user.apiEndpoint = null;
        user.apiModel = null;
      } else {
        if (!apiProvider) {
          return res.status(400).json({ error: 'API provider is required' });
        }
        user.apiKey = apiKey;
        user.apiProvider = apiProvider;
        user.apiEndpoint = apiEndpoint || null;
        user.apiModel = apiModel || 'gpt-4';
      }
    }

    await user.save();

    res.json({
      message: 'API settings updated successfully',
      settings: {
        hasApiKey: Boolean(user.apiKey),
        apiProvider: user.apiProvider,
        apiEndpoint: user.apiEndpoint,
        apiModel: user.apiModel
      }
    });
  } catch (error) {
    console.error('Update API settings error:', error);
    res.status(500).json({ error: 'Failed to update API settings' });
  }
});

module.exports = router;
