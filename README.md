# openclaw-commonstack

OpenClaw provider plugin for [CommonStack](https://commonstack.ai) - a unified model gateway with smart routing for lower cost and better latency.

Access 40+ models from OpenAI, Anthropic, Google, DeepSeek, MiniMax, Qwen, xAI and more through a single API key with pay-per-token billing.

## Install

```bash
openclaw plugins install openclaw-commonstack
```

## Setup

1. Get an API key at [commonstack.ai](https://commonstack.ai)
2. Run onboard and select CommonStack:
   ```bash
   openclaw onboard
   ```
   Or set the key directly:
   ```bash
   export COMMONSTACK_API_KEY="your-key"
   ```

## Features

- Dynamic model catalog fetched from CommonStack API
- Supports all models available on CommonStack (auto-updated)
- Pay-per-token billing, no subscriptions
- Smart routing for lower cost and better latency

## Usage

```bash
# Set default model
openclaw config set agents.defaults.model commonstack/openai/gpt-4o-mini

# Use a specific model
openclaw message send --model commonstack/anthropic/claude-sonnet-4-6 "hello"
```

## License

MIT
