const express = require('express');
const router = express.Router();
const { auth, requirePlan } = require('../middleware/auth');
const AIProvider = require('../models/AIProvider');
const { codeReviewService } = require('../services/codeReviewService');

// 获取所有 provider（管理员）
router.get('/admin', auth, requirePlan(['pro', 'team']), async (req, res) => {
  try {
    const providers = await AIProvider.findAll({
      order: [['priority', 'DESC']]
    });

    res.json({
      providers: providers.map(p => ({
        id: p.id,
        name: p.name,
        displayName: p.displayName,
        providerType: p.providerType,
        apiEndpoint: p.apiEndpoint,
        defaultModel: p.defaultModel,
        availableModels: p.availableModels,
        isActive: p.isActive,
        isDefault: p.isDefault,
        priority: p.priority,
        rateLimitRPM: p.rateLimitRPM,
        description: p.description
      }))
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to get providers' });
  }
});

// 获取可用的 provider 列表（普通用户）
router.get('/', auth, async (req, res) => {
  try {
    const providers = await AIProvider.findAll({
      where: { isActive: true },
      attributes: ['name', 'displayName', 'providerType', 'defaultModel', 'availableModels', 'description'],
      order: [['priority', 'DESC']]
    });

    res.json({ providers });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to get providers' });
  }
});

// 创建 provider（仅管理员/团队版）
router.post('/', auth, requirePlan(['team']), async (req, res) => {
  try {
    const {
      name,
      displayName,
      providerType,
      apiEndpoint,
      apiKey,
      defaultModel,
      availableModels,
      headers,
      config,
      priority,
      rateLimitRPM,
      description
    } = req.body;

    // 验证必填字段
    if (!name || !providerType || !apiEndpoint || !defaultModel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'providerType', 'apiEndpoint', 'defaultModel']
      });
    }

    // 检查名称是否已存在
    const existing = await AIProvider.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Provider name already exists' });
    }

    const provider = await AIProvider.create({
      name,
      displayName: displayName || name,
      providerType,
      apiEndpoint,
      apiKey,
      defaultModel,
      availableModels: availableModels || [defaultModel],
      headers: headers || {},
      config: config || {
        temperature: 0.3,
        maxTokens: 4000,
        timeout: 60000
      },
      priority: priority || 0,
      rateLimitRPM: rateLimitRPM || 60,
      description
    });

    // 重新加载 providers
    await codeReviewService.loadProviders();

    res.status(201).json({
      message: 'Provider created successfully',
      provider: {
        id: provider.id,
        name: provider.name,
        displayName: provider.displayName,
        providerType: provider.providerType,
        apiEndpoint: provider.apiEndpoint,
        defaultModel: provider.defaultModel,
        isActive: provider.isActive
      }
    });
  } catch (error) {
    console.error('Create provider error:', error);
    res.status(500).json({ error: 'Failed to create provider' });
  }
});

// 更新 provider
router.put('/:id', auth, requirePlan(['team']), async (req, res) => {
  try {
    const provider = await AIProvider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const updates = req.body;
    
    // 不允许通过 API 直接更新某些字段
    delete updates.id;
    delete updates.createdAt;

    await provider.update(updates);

    // 重新加载 providers
    await codeReviewService.loadProviders();

    res.json({
      message: 'Provider updated successfully',
      provider: {
        id: provider.id,
        name: provider.name,
        displayName: provider.displayName,
        isActive: provider.isActive,
        isDefault: provider.isDefault
      }
    });
  } catch (error) {
    console.error('Update provider error:', error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

// 删除 provider
router.delete('/:id', auth, requirePlan(['team']), async (req, res) => {
  try {
    const provider = await AIProvider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    await provider.destroy();

    // 重新加载 providers
    await codeReviewService.loadProviders();

    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    console.error('Delete provider error:', error);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

// 测试 provider 连接
router.post('/:id/test', auth, requirePlan(['pro', 'team']), async (req, res) => {
  try {
    const provider = await AIProvider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const { ProviderFactory } = require('../providers');
    const instance = ProviderFactory.createProvider(provider.toJSON());

    const startTime = Date.now();
    const result = await instance.reviewCode(
      'const x = 1;',
      'javascript',
      { model: provider.defaultModel }
    );

    res.json({
      success: true,
      latency: Date.now() - startTime,
      provider: provider.name,
      result: {
        summary: result.summary,
        score: result.score
      }
    });
  } catch (error) {
    console.error('Test provider error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// 获取 provider 状态
router.get('/status', auth, requirePlan(['pro', 'team']), async (req, res) => {
  try {
    const statuses = await codeReviewService.getProviderStatus();
    res.json({ statuses });
  } catch (error) {
    console.error('Get provider status error:', error);
    res.status(500).json({ error: 'Failed to get provider status' });
  }
});

// 设置默认 provider
router.post('/:id/set-default', auth, requirePlan(['team']), async (req, res) => {
  try {
    const provider = await AIProvider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // 清除其他默认 provider
    await AIProvider.update(
      { isDefault: false },
      { where: { isDefault: true } }
    );

    // 设置新的默认 provider
    await provider.update({ isDefault: true });

    // 重新加载 providers
    await codeReviewService.loadProviders();

    res.json({ message: 'Default provider updated successfully' });
  } catch (error) {
    console.error('Set default provider error:', error);
    res.status(500).json({ error: 'Failed to set default provider' });
  }
});

module.exports = router;
