const OpenAIProvider = require('./OpenAIProvider');
const AnthropicProvider = require('./AnthropicProvider');
const GoogleProvider = require('./GoogleProvider');
const OpenAICompatibleProvider = require('./OpenAICompatibleProvider');

class ProviderFactory {
  static createProvider(config) {
    switch (config.providerType) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'google':
        return new GoogleProvider(config);
      case 'openai-compatible':
      case 'custom':
        return new OpenAICompatibleProvider(config);
      default:
        throw new Error(`Unknown provider type: ${config.providerType}`);
    }
  }
}

module.exports = ProviderFactory;
