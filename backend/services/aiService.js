/**
 * Unified AI Service
 * Supports OpenAI and Claude with automatic fallback
 */

const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const { getAvailableProviders, isProviderAvailable } = require("../config/aiProviders");

class AIService {
  constructor() {
    this.initializeProviders();
  }

  initializeProviders() {
    // OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Claude (check both CLAUDE_API_KEY and ANTHROPIC_API_KEY)
    const claudeKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (claudeKey) {
      this.anthropic = new Anthropic({
        apiKey: claudeKey,
      });
    }
  }

  /**
   * Generate AI completion with automatic provider fallback
   */
  async generateCompletion(prompt, options = {}) {
    const {
      provider = process.env.DEFAULT_AI_PROVIDER || "openai",
      model = null,
      temperature = 0.7,
      maxTokens = 4000,
      systemPrompt = null,
    } = options;

    try {
      switch (provider) {
        case "openai":
          return await this.generateWithOpenAI(prompt, { model, temperature, maxTokens, systemPrompt });

        case "claude":
          return await this.generateWithClaude(prompt, { model, temperature, maxTokens, systemPrompt });

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error.message);

      // Try fallback providers
      const availableProviders = getAvailableProviders();
      for (const fallbackProvider of availableProviders) {
        if (fallbackProvider.id !== provider) {
          try {
            console.log(`Trying fallback provider: ${fallbackProvider.name}`);
            return await this.generateCompletion(prompt, { ...options, provider: fallbackProvider.id });
          } catch (fallbackError) {
            console.error(`Fallback provider ${fallbackProvider.name} also failed:`, fallbackError.message);
          }
        }
      }

      throw new Error("All AI providers failed");
    }
  }

  /**
   * OpenAI Implementation
   */
  async generateWithOpenAI(prompt, options = {}) {
    if (!this.openai) {
      throw new Error("OpenAI API key not configured");
    }

    const { model = "gpt-3.5-turbo", temperature = 0.7, maxTokens = 4000, systemPrompt } = options;

    const messages = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: prompt });

    const response = await this.openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return {
      content: response.choices[0].message.content,
      provider: "openai",
      model: response.model,
      usage: response.usage,
    };
  }

  /**
   * Claude Implementation
   */
  async generateWithClaude(prompt, options = {}) {
    if (!this.anthropic) {
      throw new Error("Claude API key not configured");
    }

    const { model = "claude-3-sonnet-20240229", temperature = 0.7, maxTokens = 4000, systemPrompt } = options;

    const messages = [{ role: "user", content: prompt }];

    const response = await this.anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt || "You are a helpful AI assistant.",
      messages,
    });

    return {
      content: response.content[0].text,
      provider: "claude",
      model: response.model,
      usage: response.usage,
    };
  }
}

module.exports = new AIService();

