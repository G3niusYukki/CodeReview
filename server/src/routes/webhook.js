const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const Webhook = require('../models/Webhook');

// 获取用户的 webhooks
router.get('/', auth, async (req, res) => {
  try {
    const webhooks = await Webhook.findAll({
      where: { userId: req.user.id, isActive: true },
      attributes: ['id', 'url', 'events', 'isActive', 'createdAt', 'lastTriggeredAt']
    });

    res.json({ webhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ error: 'Failed to get webhooks' });
  }
});

// 创建 webhook
router.post('/', auth, async (req, res) => {
  try {
    const { url, events = ['review.completed', 'review.failed'] } = req.body;

    // 生成 secret
    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await Webhook.create({
      userId: req.user.id,
      url,
      secret,
      events
    });

    res.status(201).json({
      message: 'Webhook created successfully',
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        secret: webhook.secret, // 只显示一次
        createdAt: webhook.createdAt
      }
    });
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

// 删除 webhook
router.delete('/:id', auth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    await webhook.destroy();

    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

// 测试 webhook
router.post('/:id/test', auth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    // 发送测试事件
    const payload = {
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: { message: 'This is a test event' }
    };

    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const axios = require('axios');
    
    try {
      await axios.post(webhook.url, payload, {
        headers: {
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': 'webhook.test',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      await webhook.update({ 
        lastTriggeredAt: new Date(),
        failureCount: 0
      });

      res.json({ message: 'Webhook test successful' });
    } catch (error) {
      await webhook.increment('failureCount');
      res.status(400).json({ 
        error: 'Webhook test failed',
        message: error.message 
      });
    }
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

module.exports = router;
