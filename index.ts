import {
  definePluginEntry,
  type ProviderResolveDynamicModelContext,
  type ProviderRuntimeModel,
} from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { DEFAULT_CONTEXT_TOKENS } from "openclaw/plugin-sdk/provider-model-shared";
import { applyCommonstackConfig, COMMONSTACK_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildCommonstackProvider } from "./provider-catalog.js";
import {
  COMMONSTACK_BASE_URL,
  COMMONSTACK_DEFAULT_MAX_TOKENS,
  fetchCommonstackModels,
  getCachedModel,
} from "./api.js";

const PROVIDER_ID = "commonstack";

function buildDynamicModel(ctx: ProviderResolveDynamicModelContext): ProviderRuntimeModel {
  const cached = getCachedModel(ctx.modelId);
  return {
    id: ctx.modelId,
    name: cached?.name ?? ctx.modelId,
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: COMMONSTACK_BASE_URL,
    reasoning: cached?.reasoning ?? false,
    input: cached?.input ?? ["text"],
    cost: cached?.cost ?? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: cached?.contextWindow ?? DEFAULT_CONTEXT_TOKENS,
    maxTokens: cached?.maxTokens ?? COMMONSTACK_DEFAULT_MAX_TOKENS,
  };
}

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "CommonStack Provider",
  description: "Unified gateway for OpenAI, Anthropic, Google, DeepSeek, MiniMax, Qwen and more. One API key, pay-per-token billing, no subscriptions.",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "CommonStack",
      envVars: ["COMMONSTACK_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "CommonStack API key",
          hint: "API key",
          optionKey: "commonstackApiKey",
          flagName: "--commonstack-api-key",
          envVar: "COMMONSTACK_API_KEY",
          promptMessage: "Enter CommonStack API key",
          defaultModel: COMMONSTACK_DEFAULT_MODEL_REF,
          expectedProviders: [PROVIDER_ID],
          applyConfig: (cfg) => applyCommonstackConfig(cfg),
          noteTitle: "CommonStack",
          noteMessage: [
            "CommonStack is a unified model gateway with smart routing for lower cost and better latency.",
            "Get an API key for all models: https://commonstack.ai",
          ].join("\n"),
          wizard: {
            choiceId: "commonstack-api-key",
            choiceLabel: "CommonStack API key",
            groupId: "commonstack",
            groupLabel: "CommonStack",
            groupHint: "Unified Model Gateway with smart routing",
          },
        }),
      ],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) {
            return null;
          }
          return {
            provider: {
              ...(await buildCommonstackProvider(apiKey)),
              apiKey,
            },
          };
        },
      },
      resolveDynamicModel: (ctx) => buildDynamicModel(ctx),
      prepareDynamicModel: async (ctx) => {
        // Pre-fetch models so getCachedModel has data for resolveDynamicModel
        const apiKey = ctx.resolveProviderApiKey?.(PROVIDER_ID)?.apiKey;
        if (apiKey) {
          await fetchCommonstackModels(apiKey);
        }
      },
    });
  },
});
