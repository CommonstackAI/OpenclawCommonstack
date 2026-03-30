# openclaw-commonstack

OpenClaw provider plugin for [CommonStack](https://commonstack.ai) - a unified model gateway with smart routing for lower cost and better latency.

Access 40+ models from OpenAI, Anthropic, Google, DeepSeek, MiniMax, Qwen, xAI and more through a single API key with pay-per-token billing.

**ClawHub**: [openclaw-commonstack](https://clawhub.ai/plugins/openclaw-commonstack)

**npm**: https://www.npmjs.com/package/openclaw-commonstack

**GitHub**: https://github.com/CommonstackAI/OpenclawCommonstack

## Prerequisites

- [OpenClaw](https://docs.openclaw.ai) installed and running
- A CommonStack API key (get one at [commonstack.ai](https://commonstack.ai))

## Quick Start

### Step 1: Install the plugin

```bash
# Install from ClawHub / npm (auto-resolved)
openclaw plugins install openclaw-commonstack
```

Alternative install methods:

```bash
# From git
git clone https://github.com/CommonstackAI/OpenclawCommonstack.git
openclaw plugins install ./OpenclawCommonstack

# From local path (development)
openclaw plugins install -l ./openclaw-commonstack
```

### Step 2: Restart the gateway

```bash
openclaw gateway restart
```

### Step 3: Configure via onboard (recommended)

```bash
openclaw onboard
```

Select **CommonStack** from the provider list, then enter your API key when prompted.

### Or configure manually

```bash
# Set API key via environment variable
export COMMONSTACK_API_KEY="your-api-key"

# Set CommonStack as default model provider
openclaw config set agents.defaults.model commonstack/openai/gpt-4o-mini
```

## Usage

### Send a message with the default model

```bash
openclaw message send "Hello, how are you?"
```

### Use a specific model

```bash
# OpenAI
openclaw message send --model commonstack/openai/gpt-4.1 "Explain quantum computing"

# Anthropic
openclaw message send --model commonstack/anthropic/claude-sonnet-4-6 "Write a haiku"

# Google
openclaw message send --model commonstack/google/gemini-2.5-flash "Summarize this article"

# DeepSeek
openclaw message send --model commonstack/deepseek/deepseek-v3.1 "Solve this math problem"

# Qwen
openclaw message send --model commonstack/qwen/qwen3.5-397b-a17b "Translate to Chinese"

# xAI
openclaw message send --model commonstack/x-ai/grok-4.1-fast-non-reasoning "Tell me a joke"
```

### Switch default model

```bash
openclaw config set agents.defaults.model commonstack/anthropic/claude-sonnet-4-6
```

## Features

- **Dynamic model catalog** - Models are fetched from CommonStack API at runtime. New models are available automatically without plugin updates.
- **40+ models** - Access OpenAI, Anthropic, Google, DeepSeek, MiniMax, Qwen, xAI, Zhipu, Kimi and more.
- **Smart routing** - Lower cost and better latency through intelligent request routing.
- **Pay-per-token** - No subscriptions. Pay only for what you use with consolidated billing.
- **Dynamic model resolution** - Use any model ID available on CommonStack, even if it's not in the cached catalog.

## Plugin Management

```bash
# Check plugin status
openclaw plugins list

# View plugin details
openclaw plugins inspect commonstack

# Disable plugin
openclaw plugins disable commonstack

# Re-enable plugin
openclaw plugins enable commonstack

# Uninstall plugin
openclaw plugins uninstall commonstack
```

## Supported Models

The plugin dynamically fetches all available models from CommonStack. As of now, this includes models from:

| Provider  | Example Models                                         |
| --------- | ------------------------------------------------------ |
| OpenAI    | gpt-4.1, gpt-5, gpt-5.4, gpt-4o-mini                   |
| Anthropic | claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5   |
| Google    | gemini-2.5-flash, gemini-2.5-pro, gemini-3-pro-preview |
| DeepSeek  | deepseek-v3.1, deepseek-v3.2, deepseek-r1-0528         |
| MiniMax   | minimax-m2, minimax-m2.5, minimax-m2.7                 |
| Qwen      | qwen3.5-397b-a17b, qwen3-coder-480b-a35b-instruct      |
| xAI       | grok-4.1-fast-reasoning, grok-code-fast-1              |
| Zhipu     | glm-5, glm-4.7, glm-5-turbo                            |
| Kimi      | kimi-k2.5, kimi-k2-thinking                            |
| Xiaomi    | mimo-v2-pro, mimo-v2-omni                              |

For the full up-to-date list, visit [commonstack.ai](https://commonstack.ai).

## Compatibility

- OpenClaw >= 2026.3.28

## License

MIT
