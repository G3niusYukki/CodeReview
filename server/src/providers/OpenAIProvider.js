const BaseProvider = require('./BaseProvider');

class OpenAIProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.providerType = 'openai';
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
          messages: [
            { role: 'system', content: prompts.system },
            { role: 'user', content: prompts.user }
          ],
          temperature: this.providerConfig.temperature || 0.3,
          max_tokens: this.providerConfig.maxTokens || 4000,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...this.headers
          },
          timeout: this.providerConfig.timeout || 60000
        }
      );

      const processingTime = (Date.now() - startTime) / 1000;
      const content = response.data.choices[0].message.content;
      
      let result;
      try {
        result = JSON.parse(content);
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
    // 基础解析逻辑
    return {
      summary: 'Failed to parse structured response',
      score: { security: 50, performance: 50, maintainability: 50, overall: 50 },
      issues: [],
      metrics: { totalIssues: 0, securityIssues: 0, performanceIssues: 0, qualityIssues: 0 },
      rawResponse: text
    };
  }
}

module.exports = OpenAIProvider;
