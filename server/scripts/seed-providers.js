const AIProvider = require('../src/models/AIProvider');
const sequelize = require('../src/config/database');

const defaultProviders = [
  {
    name: 'openai',
    displayName: 'OpenAI GPT',
    providerType: 'openai',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4',
    availableModels: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      timeout: 60000
    },
    isActive: false,
    isDefault: false,
    priority: 100,
    description: 'OpenAI GPT models'
  },
  {
    name: 'anthropic',
    displayName: 'Anthropic Claude',
    providerType: 'anthropic',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-opus-20240229',
    availableModels: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      timeout: 60000
    },
    isActive: false,
    isDefault: false,
    priority: 90,
    description: 'Anthropic Claude models'
  },
  {
    name: 'google',
    displayName: 'Google Gemini',
    providerType: 'google',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    defaultModel: 'gemini-pro',
    availableModels: ['gemini-pro', 'gemini-pro-vision'],
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      timeout: 60000
    },
    isActive: false,
    isDefault: false,
    priority: 80,
    description: 'Google Gemini models'
  }
];

async function seedProviders() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    for (const provider of defaultProviders) {
      const [instance, created] = await AIProvider.findOrCreate({
        where: { name: provider.name },
        defaults: provider
      });

      if (created) {
        console.log(`Created provider: ${provider.name}`);
      } else {
        console.log(`Provider already exists: ${provider.name}`);
      }
    }

    console.log('Provider seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedProviders();
