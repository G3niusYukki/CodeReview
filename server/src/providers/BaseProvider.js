const axios = require('axios');

class BaseProvider {
  constructor(config) {
    this.config = config;
    this.name = config.name;
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel;
    this.headers = config.headers || {};
    this.providerConfig = config.config || {};
  }

  async reviewCode(codeContent, language, options = {}) {
    throw new Error('reviewCode method must be implemented by subclass');
  }

  generatePrompt(codeContent, language, options) {
    return {
      system: `You are an expert code reviewer. Analyze the code and return a JSON object with this exact structure:

{
  "summary": "Brief overview of the code quality (2-3 sentences)",
  "score": {
    "security": 0-100,
    "performance": 0-100,
    "maintainability": 0-100,
    "overall": 0-100
  },
  "issues": [
    {
      "id": 1,
      "severity": "high|medium|low",
      "category": "security|performance|quality|best_practice",
      "title": "Brief issue title",
      "description": "Detailed explanation",
      "line": line_number_or_null,
      "suggestion": "How to fix it"
    }
  ],
  "metrics": {
    "totalIssues": number,
    "securityIssues": number,
    "performanceIssues": number,
    "qualityIssues": number
  }
}

Analyze for:
1. Security vulnerabilities (SQL injection, XSS, auth issues, etc.)
2. Performance problems
3. Code quality and maintainability
4. Potential bugs
5. Architecture and best-practice improvements

Language: ${language}
${options.language === 'zh' ? 'Respond in Chinese.' : 'Respond in English.'}

Be specific with line numbers and provide actionable suggestions. If no issues found in a category, set count to 0.`,
      user: `Please review this code:\n\n\`\`\`${language}\n${codeContent}\n\`\`\``
    };
  }

  parseResponse(response) {
    return response;
  }

  handleError(error) {
    console.error(`${this.name} API Error:`, error.response?.data || error.message);
    throw new Error(`Code review failed: ${error.message}`);
  }
}

module.exports = BaseProvider;
