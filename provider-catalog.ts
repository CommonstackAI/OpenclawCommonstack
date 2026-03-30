import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import {
  COMMONSTACK_BASE_URL,
  fetchCommonstackModels,
} from "./api.js";

export async function buildCommonstackProvider(apiKey: string): Promise<ModelProviderConfig> {
  const models = await fetchCommonstackModels(apiKey);
  return {
    baseUrl: COMMONSTACK_BASE_URL,
    api: "openai-completions",
    models,
  };
}
