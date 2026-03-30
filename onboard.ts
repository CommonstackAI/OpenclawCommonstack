import {
  applyAgentDefaultModelPrimary,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import { COMMONSTACK_BASE_URL } from "./api.js";

export const COMMONSTACK_DEFAULT_MODEL_REF = "commonstack/openai/gpt-4o-mini";

/**
 * Apply CommonStack provider config during onboarding.
 *
 * At onboard time we don't have the full dynamic catalog yet (API key was just
 * entered). We write the minimal provider entry (baseUrl + api) so the gateway
 * can boot; the dynamic catalog.run will populate the full model list on first
 * startup with the key.
 */
export function applyCommonstackConfig(cfg: OpenClawConfig): OpenClawConfig {
  const updated = {
    ...cfg,
    models: {
      ...(cfg as Record<string, unknown>).models,
      providers: {
        ...((cfg as Record<string, unknown>).models as Record<string, unknown> | undefined)
          ?.providers,
        commonstack: {
          baseUrl: COMMONSTACK_BASE_URL,
          api: "openai-completions",
          models: [],
        },
      },
    },
  } as OpenClawConfig;
  return applyAgentDefaultModelPrimary(updated, COMMONSTACK_DEFAULT_MODEL_REF);
}
