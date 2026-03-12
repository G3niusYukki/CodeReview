const BaseProvider = require('./BaseProvider');

class AnthropicProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.providerType = 'anthropic';
  }

  async reviewCode(codeContent, language, options = {}) {
    const startTime = Date.now();
    
    try {
      const prompts = this.generatePrompt(codeContent, language, options);
      const axios = require('axios');
      
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: options.model || this.defaultModel,
          max_tokens: this.providerConfig.maxTokens || 4000,
          temperature: this.providerConfig.temperature || 0.3,
          system: prompts.system,
          messages: [
            { role: 'user', content: prompts.user }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
            ...this.headers
          },
          timeout: this.providerConfig.timeout || 60000
        }
      );

      const processingTime = (Date.now() - startTime) / 1000;
      const content = response.data.content[0].text;
      
      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (e) {
        result = this.fallbackParse(content);
      }
      
      return {
        ...result,
        processingTime,
        provider: this.name
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  fallbackParse(text) {
    return {
      summary: 'Failed to parse structured response from Anthropic',
      score: { security: 50, performance: 50, maintainability: 50, overall: 50 },
      issues: [],
      metrics: { totalIssues: 0, securityIssues: 0, performanceIssues: 0, qualityIssues: 0 },
      rawResponse: text
    };
  }
}

module.exports = AnthropicProvider;
