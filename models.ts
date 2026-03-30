import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";

export const COMMONSTACK_BASE_URL = "https://api.commonstack.ai/v1";
export const COMMONSTACK_MODELS_API_URL = "https://api.commonstack.ai/api/v1/ai/models";
export const COMMONSTACK_DEFAULT_MAX_TOKENS = 8192;
export const COMMONSTACK_DEFAULT_CONTEXT_WINDOW = 128000;

/** Raw model shape returned by the CommonStack /models API. */
export interface CommonstackApiModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  pricing: {
    prompt: string;
    completion: string;
    input_cache_reads?: string;
    input_cache_writes?: string;
    currency: string;
  };
}

/** Known reasoning model ID patterns. */
const REASONING_PATTERNS = [
  /deepseek.*r1/i,
  /\bo[34]-mini/i,
  /\bo[34]\b/i,
  /reasoning/i,
  /thinking/i,
  /gemini.*pro/i,
  /gemini.*flash/i,
  /grok.*reasoning/i,
];

/** Known vision-capable model ID patterns. */
const VISION_PATTERNS = [
  /gpt-4/i,
  /gpt-5/i,
  /claude/i,
  /gemini/i,
  /image/i,
  /vision/i,
  /omni/i,
  /vl\b/i,
  /mimo/i,
];

function isReasoningModel(modelId: string): boolean {
  return REASONING_PATTERNS.some((p) => p.test(modelId));
}

function hasVisionInput(modelId: string): boolean {
  return VISION_PATTERNS.some((p) => p.test(modelId));
}

/** Convert per-token price string to per-million-token number. */
function toPerMillion(perToken: string | undefined): number {
  if (!perToken) return 0;
  return parseFloat(perToken) * 1_000_000;
}

/** Convert a CommonStack API model to an OpenClaw model definition. */
export function apiModelToDefinition(m: CommonstackApiModel): ModelDefinitionConfig {
  return {
    id: m.id,
    name: m.id,
    api: "openai-completions",
    reasoning: isReasoningModel(m.id),
    input: hasVisionInput(m.id) ? ["text", "image"] : ["text"],
    contextWindow: COMMONSTACK_DEFAULT_CONTEXT_WINDOW,
    maxTokens: COMMONSTACK_DEFAULT_MAX_TOKENS,
    cost: {
      input: toPerMillion(m.pricing.prompt),
      output: toPerMillion(m.pricing.completion),
      cacheRead: toPerMillion(m.pricing.input_cache_reads),
      cacheWrite: toPerMillion(m.pricing.input_cache_writes),
    },
  };
}

/** In-memory model cache. */
let cachedModels: ModelDefinitionConfig[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Fetch models from the CommonStack API and cache them. */
export async function fetchCommonstackModels(apiKey: string): Promise<ModelDefinitionConfig[]> {
  const now = Date.now();
  if (cachedModels && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedModels;
  }

  const response = await fetch(COMMONSTACK_MODELS_API_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    // Return cached models if available, otherwise empty
    return cachedModels ?? [];
  }

  const body = (await response.json()) as { data: CommonstackApiModel[] };
  cachedModels = body.data.map(apiModelToDefinition);
  cacheTimestamp = now;
  return cachedModels;
}

/** Look up a single model from cache (does not fetch). */
export function getCachedModel(modelId: string): ModelDefinitionConfig | undefined {
  return cachedModels?.find((m) => m.id === modelId);
}
