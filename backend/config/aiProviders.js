/**
 * AI Providers Configuration
 * Supports: OpenAI, Claude (Anthropic)
 */

const providers = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"],
    defaultModel: "gpt-3.5-turbo",
    requiresKey: "OPENAI_API_KEY",
  },
  claude: {
    name: "Anthropic Claude",
    models: [
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ],
    defaultModel: "claude-3-sonnet-20240229",
    requiresKey: "CLAUDE_API_KEY",
  },
};

const getAvailableProviders = () => {
  const available = [];

  for (const [key, provider] of Object.entries(providers)) {
    if (process.env[provider.requiresKey]) {
      available.push({
        id: key,
        name: provider.name,
        models: provider.models,
        defaultModel: provider.defaultModel,
      });
    }
  }

  return available;
};

const getProvider = (providerId) => {
  return providers[providerId] || providers.openai;
};

const isProviderAvailable = (providerId) => {
  const provider = providers[providerId];
  return provider && !!process.env[provider.requiresKey];
};

module.exports = {
  providers,
  getAvailableProviders,
  getProvider,
  isProviderAvailable,
};
