# AI Gateway Adapters

> 28 nodes · cohesion 0.13

## Key Concepts

- **gatewayCore.ts** (15 connections) — `src/ai/gatewayCore.ts`
- **geminiAdapter.mts** (11 connections) — `netlify/functions/geminiAdapter.mts`
- **gatewayHttp.ts** (11 connections) — `src/ai/gatewayHttp.ts`
- **handleAiRequest()** (10 connections) — `src/ai/gatewayCore.ts`
- **AiResponse** (9 connections) — `src/ai/contracts.ts`
- **AiTask** (8 connections) — `src/ai/contracts.ts`
- **gatewayCore.test.ts** (8 connections) — `src/__tests__/ai/gatewayCore.test.ts`
- **AiFailure** (7 connections) — `src/ai/contracts.ts`
- **AI_GATEWAY_SCHEMA_VERSION** (6 connections) — `src/ai/contracts.ts`
- **processGatewayHttp()** (6 connections) — `src/ai/gatewayHttp.ts`
- **gatewayHttp.test.ts** (6 connections) — `src/__tests__/ai/gatewayHttp.test.ts`
- **ai-gateway.mts** (4 connections) — `netlify/functions/ai-gateway.mts`
- **AiProviderAdapter** (4 connections) — `src/ai/gatewayCore.ts`
- **.generate()** (3 connections) — `src/ai/gatewayCore.ts`
- **GatewayContext** (3 connections) — `src/ai/gatewayCore.ts`
- **createGeminiAdapter()** (2 connections) — `netlify/functions/geminiAdapter.mts`
- **withTimeout()** (2 connections) — `src/ai/gatewayCore.ts`
- **GatewayHttpResult** (2 connections) — `src/ai/gatewayHttp.ts`
- **statusForResponse()** (2 connections) — `src/ai/gatewayHttp.ts`
- **IMAGE_TASKS** (1 connections) — `netlify/functions/geminiAdapter.mts`
- **imageDataUrlFromPayload()** (1 connections) — `netlify/functions/geminiAdapter.mts`
- **TASK_SCHEMAS** (1 connections) — `netlify/functions/geminiAdapter.mts`
- **GatewayTimeoutError** (1 connections) — `src/ai/gatewayCore.ts`
- **adapter()** (1 connections) — `src/__tests__/ai/gatewayCore.test.ts`
- **request** (1 connections) — `src/__tests__/ai/gatewayCore.test.ts`
- *... and 3 more nodes in this community*

## Relationships

- [AI Gateway Contracts](AI_Gateway_Contracts.md) (14 shared connections)
- [AI Gateway Client](AI_Gateway_Client.md) (7 shared connections)
- [Monster & NPC Generator](Monster_%26_NPC_Generator.md) (4 shared connections)
- [AI Prompt Builders](AI_Prompt_Builders.md) (3 shared connections)
- [AI Encounter Draft Flow](AI_Encounter_Draft_Flow.md) (1 shared connections)
- [AI Creature Identification](AI_Creature_Identification.md) (1 shared connections)

## Source Files

- `netlify/functions/ai-gateway.mts`
- `netlify/functions/geminiAdapter.mts`
- `src/__tests__/ai/gatewayCore.test.ts`
- `src/__tests__/ai/gatewayHttp.test.ts`
- `src/ai/contracts.ts`
- `src/ai/gatewayCore.ts`
- `src/ai/gatewayHttp.ts`

## Audit Trail

- EXTRACTED: 128 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*