const axios = require('axios');
const crypto = require('crypto');
const Webhook = require('../models/Webhook');

class WebhookService {
  static async trigger(userId, event, data) {
    try {
      const webhooks = await Webhook.findAll({
        where: {
          userId,
          isActive: true
        }
      });

      for (const webhook of webhooks) {
        if (!webhook.events.includes(event)) continue;

        const payload = {
          event,
          timestamp: new Date().toISOString(),
          data
        };

        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify(payload))
          .digest('hex');

        try {
          await axios.post(webhook.url, payload, {
            headers: {
              'X-Webhook-Signature': signature,
              'X-Webhook-Event': event,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          });

          await webhook.update({ 
            lastTriggeredAt: new Date(),
            failureCount: 0
          });
        } catch (error) {
          console.error(`Webhook ${webhook.id} failed:`, error.message);
          await webhook.increment('failureCount');
          
          // 如果失败次数过多，禁用 webhook
          if (webhook.failureCount >= 5) {
            await webhook.update({ isActive: false });
          }
        }
      }
    } catch (error) {
      console.error('Trigger webhooks error:', error);
    }
  }
}

module.exports = WebhookService;
