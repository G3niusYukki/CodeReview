# User Guide: Using Your Own API Key

## Overview

CodeReview allows **free users** to use their own API keys for unlimited code reviews. This means you can bring your own OpenAI, Anthropic, or Google API key and use the platform without any review limits!

## Supported AI Providers

- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude 3)
- **Google** (Gemini)
- **Custom** (Any OpenAI-compatible endpoint)

## How to Use Your Own API Key

### Step 1: Get an API Key

#### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy your API key

#### Anthropic
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create an account
3. Navigate to "API Keys"
4. Generate a new key

#### Google (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Sign in with Google
3. Create an API key
4. Copy the key

### Step 2: Configure in CodeReview

1. **Log in** to your CodeReview account
2. Go to **Settings** → **API Configuration**
3. Select your **AI Provider**
4. Enter your **API Key**
5. (Optional) Select specific **Model** (e.g., gpt-4, claude-3-opus)
6. (Optional) Enter **Custom Endpoint** (for custom providers only)
7. Click **Save**

### Step 3: Start Reviewing!

Once configured, all your code reviews will use your own API key:
- **No review limits**
- **You control the costs**
- **Priority processing**

## Cost Estimation

### OpenAI Pricing
- GPT-4: ~$0.03 per review (average code)
- GPT-3.5: ~$0.002 per review

### Anthropic Pricing
- Claude 3 Opus: ~$0.05 per review
- Claude 3 Sonnet: ~$0.015 per review
- Claude 3 Haiku: ~$0.002 per review

### Example
If you review 100 code files per month with GPT-4:
- Cost: ~$3.00 USD
- Much cheaper than paid plans!

## FAQ

### Q: Is my API key secure?
**A:** Yes! Your API key is:
- Encrypted at rest in our database
- Never displayed in the UI after saving
- Only used for your own code reviews
- Never shared or logged

### Q: What happens if my API key is invalid?
**A:** If your API key fails, the system will:
1. Try to use your key
2. If it fails, fall back to the system provider (if available)
3. Show an error if neither works

### Q: Can I switch back to the system provider?
**A:** Yes! Simply:
1. Go to Settings → API Configuration
2. Clear your API key
3. Save
4. Your account will use the system default

### Q: Do I still get all features with my own API?
**A:** Yes! All features work:
- ✅ Code review
- ✅ Review history
- ✅ Webhooks
- ✅ GitHub integration
- ✅ All analysis types (security, performance, quality)

### Q: What if I run out of API credits?
**A:** Your code reviews will fail with an error. You can:
1. Add more credits to your AI provider account
2. Switch back to the system provider (subject to plan limits)
3. Upgrade to a paid plan

### Q: Can I use different models?
**A:** Yes! Depending on your provider:
- **OpenAI**: gpt-4, gpt-4-turbo, gpt-3.5-turbo
- **Anthropic**: claude-3-opus, claude-3-sonnet, claude-3-haiku
- **Google**: gemini-pro

### Q: Is there a free tier for API keys?
**A:** Most providers offer free credits:
- **OpenAI**: $5-18 free credits for new accounts
- **Anthropic**: $5 free credits for new accounts
- **Google**: Free tier available with rate limits

## Troubleshooting

### "Invalid API key" Error
- Check if you copied the entire key
- Verify the key hasn't been revoked
- Ensure you selected the correct provider

### "API provider not responding"
- Check your internet connection
- Verify the API endpoint URL (for custom providers)
- Check your provider's status page

### "Rate limit exceeded"
- You've hit your AI provider's rate limit
- Wait a few minutes and try again
- Consider upgrading your provider plan

### Reviews not using my API key
- Verify the key is saved (check Settings)
- Ensure your plan is "Free" (paid plans use system provider by default)
- Check browser console for errors

## Best Practices

1. **Set up billing alerts** with your API provider
2. **Monitor your usage** regularly
3. **Use cheaper models** (GPT-3.5, Claude Haiku) for testing
4. **Save expensive models** (GPT-4, Claude Opus) for critical reviews
5. **Rotate your API keys** periodically
6. **Never share your API key** with others

## Support

If you have issues with your API key:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review your AI provider's documentation
3. Contact us with error details

## Privacy

When you use your own API key:
- Your code is sent directly to your chosen AI provider
- We don't store your code after review
- Your API key is encrypted and secure
- You maintain full control over your data

---

**Ready to start?** Get your API key and configure it in Settings now!
