const { ProviderFactory } = require('../providers');
const AIProvider = require('../models/AIProvider');

const PLAN_CONFIGS = {
  free: { limit: 5, price: 0, name: 'Free' },
  basic: { limit: 50, price: 19, name: 'Basic' },
  pro: { limit: 200, price: 49, name: 'Pro' },
  team: { limit: 1000, price: 199, name: 'Team' }
};

class CodeReviewService {
  constructor() {
    this.providers = new Map();
    this.defaultProvider = null;
  }

  async loadProviders() {
    try {
      const providers = await AIProvider.findAll({
        where: { isActive: true },
        order: [['priority', 'DESC']]
      });

      this.providers.clear();
      
      for (const config of providers) {
        try {
          const provider = ProviderFactory.createProvider(config);
          this.providers.set(config.name, provider);
          
          if (config.isDefault) {
            this.defaultProvider = provider;
          }
        } catch (error) {
          console.error(`Failed to load provider ${config.name}:`, error.message);
        }
      }

      // 如果没有默认 provider，使用第一个
      if (!this.defaultProvider && this.providers.size > 0) {
        this.defaultProvider = Array.from(this.providers.values())[0];
      }

      console.log(`Loaded ${this.providers.size} AI providers`);
    } catch (error) {
      console.error('Failed to load providers:', error);
      // 使用环境变量中的 GLM 作为 fallback
      this.loadFallbackProvider();
    }
  }

  loadFallbackProvider() {
    if (process.env.GLM5_API_URL && process.env.GLM5_API_KEY) {
      const fallbackConfig = {
        name: 'glm-fallback',
        providerType: 'openai-compatible',
        apiEndpoint: process.env.GLM5_API_URL,
        apiKey: process.env.GLM5_API_KEY,
        defaultModel: 'glm-4',
        config: {
          temperature: 0.3,
          maxTokens: 4000,
          timeout: 60000,
          supportsJsonMode: true
        }
      };
      
      const provider = ProviderFactory.createProvider(fallbackConfig);
      this.providers.set('glm-fallback', provider);
      this.defaultProvider = provider;
      
      console.log('Loaded fallback GLM provider');
    }
  }

  async reviewCode(codeContent, language, options = {}) {
    const providerName = options.provider;
    let provider = providerName ? this.providers.get(providerName) : this.defaultProvider;
    
    if (!provider) {
      // 尝试重新加载 providers
      await this.loadProviders();
      provider = providerName ? this.providers.get(providerName) : this.defaultProvider;
      
      if (!provider) {
        throw new Error('No AI provider available');
      }
    }

    return provider.reviewCode(codeContent, language, options);
  }

  getAvailableProviders() {
    return Array.from(this.providers.keys()).map(name => {
      const provider = this.providers.get(name);
      return {
        name: provider.name,
        type: provider.providerType,
        isDefault: provider === this.defaultProvider
      };
    });
  }

  async getProviderStatus() {
    const statuses = [];
    
    for (const [name, provider] of this.providers) {
      try {
        // 简单 ping 测试
        const startTime = Date.now();
        await provider.reviewCode('const x = 1;', 'javascript', { 
          model: provider.defaultModel 
        });
        
        statuses.push({
          name,
          status: 'healthy',
          latency: Date.now() - startTime
        });
      } catch (error) {
        statuses.push({
          name,
          status: 'unhealthy',
          error: error.message
        });
      }
    }
    
    return statuses;
  }
}

// 创建单例实例
const codeReviewService = new CodeReviewService();

// 导出兼容旧代码的函数
async function reviewCode(codeContent, language, options = {}) {
  // 确保 providers 已加载
  if (codeReviewService.providers.size === 0) {
    await codeReviewService.loadProviders();
  }
  return codeReviewService.reviewCode(codeContent, language, options);
}

module.exports = {
  reviewCode,
  PLAN_CONFIGS,
  CodeReviewService,
  codeReviewService
};
