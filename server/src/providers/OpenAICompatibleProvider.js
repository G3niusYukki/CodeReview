const OpenAIProvider = require('./OpenAIProvider');

class OpenAICompatibleProvider extends OpenAIProvider {
  constructor(config) {
    super(config);
    this.providerType = 'openai-compatible';
  }

  async reviewCode(codeContent, language, options = {}) {
    const startTime = Date.now();
    
    try {
      const prompts = this.generatePrompt(codeContent, language, options);
      const axios = require('axios');
      
      const requestBody = {
        model: options.model || this.defaultModel,
        messages: [
          { role: 'system', content: prompts.system },
          { role: 'user', content: prompts.user }
        ],
        temperature: this.providerConfig.temperature || 0.3,
        max_tokens: this.providerConfig.maxTokens || 4000
      };

      // 对于支持 JSON mode 的 API
      if (this.providerConfig.supportsJsonMode !== false) {
        requestBody.response_format = { type: 'json_object' };
      }

      const headers = {
        'Content-Type': 'application/json',
        ...this.headers
      };

      // 支持多种认证方式
      if (this.apiKey) {
        if (this.providerConfig.authType === 'bearer') {
          headers['Authorization'] = `Bearer ${this.apiKey}`;
        } else if (this.providerConfig.authType === 'x-api-key') {
          headers['x-api-key'] = this.apiKey;
        } else {
          headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
      }

      const response = await axios.post(
        this.apiEndpoint,
        requestBody,
        {
          headers,
          timeout: this.providerConfig.timeout || 60000
        }
      );

      const processingTime = (Date.now() - startTime) / 1000;
      
      // 兼容不同的响应格式
      let content;
      if (response.data.choices && response.data.choices[0].message) {
        content = response.data.choices[0].message.content;
      } else if (response.data.content && response.data.content[0]) {
        content = response.data.content[0].text;
      } else {
        content = JSON.stringify(response.data);
      }
      
      let result;
      try {
        result = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
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
}

module.exports = OpenAICompatibleProvider;
