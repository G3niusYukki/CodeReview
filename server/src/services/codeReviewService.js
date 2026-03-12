const axios = require('axios');

const PLAN_CONFIGS = {
  free: { limit: 5, price: 0, name: 'Free' },
  basic: { limit: 50, price: 19, name: 'Basic' },
  pro: { limit: 200, price: 49, name: 'Pro' },
  team: { limit: 1000, price: 199, name: 'Team' }
};

async function reviewCode(codeContent, language, options = {}) {
  const startTime = Date.now();
  
  try {
    const systemPrompt = generateStructuredPrompt(language, options);

    const response = await axios.post(
      process.env.GLM5_API_URL,
      {
        model: 'glm-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please review this code:\n\n\`\`\`${language}\n${codeContent}\n\`\`\`` }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GLM5_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const processingTime = (Date.now() - startTime) / 1000;
    const reviewText = response.data.choices[0].message.content;
    
    let structuredResult;
    try {
      structuredResult = JSON.parse(reviewText);
    } catch (e) {
      console.warn('Failed to parse JSON response, falling back to text parsing');
      structuredResult = fallbackParse(reviewText);
    }
    
    return {
      ...structuredResult,
      processingTime
    };
  } catch (error) {
    console.error('GLM-5 API Error:', error.response?.data || error.message);
    throw new Error(`Code review failed: ${error.message}`);
  }
}

function generateStructuredPrompt(language, options) {
  return `You are an expert code reviewer. Analyze the code and return a JSON object with this exact structure:

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

Be specific with line numbers and provide actionable suggestions. If no issues found in a category, set count to 0.`;
}

function fallbackParse(reviewText) {
  const issues = [];
  let securityIssues = 0;
  let performanceIssues = 0;
  let bestPracticeIssues = 0;

  const securityPatterns = [
    /sql injection|injection|authentication|authorization|xss|csrf/gi
  ];
  
  const performancePatterns = [
    /performance|slow|optimization|efficient|n\+1|memory leak/gi
  ];
  
  const bestPracticePatterns = [
    /best practice|clean code|refactor|maintainable|solid|dry|kiss/gi
  ];

  const sections = reviewText.split(/\n(?=\d+\.|[\-•*]|Security|Performance|Best Practice|Issue|Problem)/gi);
  
  sections.forEach((section, index) => {
    if (!section.trim()) return;
    
    let type = 'general';
    if (securityPatterns.some(p => p.test(section))) {
      type = 'security';
      securityIssues++;
    } else if (performancePatterns.some(p => p.test(section))) {
      type = 'performance';
      performanceIssues++;
    } else if (bestPracticePatterns.some(p => p.test(section))) {
      type = 'best_practice';
      bestPracticeIssues++;
    }
    
    const lineNumber = extractLineNumber(section);
    
    issues.push({
      id: index + 1,
      type,
      category: type,
      title: section.split('\n')[0].substring(0, 100),
      description: section.trim(),
      line: lineNumber,
      severity: determineSeverity(section),
      suggestion: 'See description for details'
    });
  });

  const summary = extractSummary(reviewText);

  return {
    summary,
    score: {
      security: Math.max(0, 100 - securityIssues * 10),
      performance: Math.max(0, 100 - performanceIssues * 10),
      maintainability: Math.max(0, 100 - bestPracticeIssues * 5),
      overall: Math.max(0, 100 - issues.length * 5)
    },
    issues,
    metrics: {
      totalIssues: issues.length,
      securityIssues,
      performanceIssues,
      qualityIssues: bestPracticeIssues
    }
  };
}

function extractLineNumber(text) {
  const match = text.match(/line\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

function determineSeverity(text) {
  const highKeywords = /critical|severe|vulnerability|security risk|dangerous/gi;
  const mediumKeywords = /warning|important|should|recommend/gi;
  
  if (highKeywords.test(text)) return 'high';
  if (mediumKeywords.test(text)) return 'medium';
  return 'low';
}

function extractSummary(text) {
  const summaryMatch = text.match(/(?:summary|conclusion|overall)[\s\S]*?(?=\n\n|\n\d+\.|$)/i);
  return summaryMatch ? summaryMatch[0].trim() : 'Code review completed.';
}

module.exports = {
  reviewCode,
  PLAN_CONFIGS
};
