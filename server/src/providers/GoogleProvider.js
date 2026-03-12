const BaseProvider = require('./BaseProvider');

class GoogleProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.providerType = 'google';
  }

  async reviewCode(codeContent, language, options = {}) {
    const startTime = Date.now();
    
    try {
      const prompts = this.generatePrompt(codeContent, language, options);
      const axios = require('axios');
      
      const response = await axios.post(
        `${this.apiEndpoint}?key=${this.apiKey}`,
        {
          contents: [
            { role: 'user', parts: [{ text: prompts.system + '\n\n' + prompts.user }] }
          ],
          generationConfig: {
            temperature: this.providerConfig.temperature || 0.3,
            maxOutputTokens: this.providerConfig.maxTokens || 4000
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.headers
          },
          timeout: this.providerConfig.timeout || 60000
        }
      );

      const processingTime = (Date.now() - startTime) / 1000;
      const content = response.data.candidates[0].content.parts[0].text;
      
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
      summary: 'Failed to parse structured response from Google',
      score: { security: 50, performance: 50, maintainability: 50, overall: 50 },
      issues: [],
      metrics: { totalIssues: 0, securityIssues: 0, performanceIssues: 0, qualityIssues: 0 },
      rawResponse: text
    };
  }
}

module.exports = GoogleProvider;
