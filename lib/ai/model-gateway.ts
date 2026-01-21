/**
 * AI Model Gateway - Multi-provider client with fallback
 */

// ============================================================================
// MODEL DEFINITIONS
// ============================================================================

const MODELS = {
  ANTHROPIC_LATEST: "claude-sonnet-4-20250514",
  ANTHROPIC_FALLBACKS: [
    "claude-sonnet-4-20250514",
    "claude-3-5-sonnet-20241022",
    "claude-3-haiku-20240307",
  ],

  OPENAI_LATEST: "gpt-4o",
  OPENAI_FALLBACKS: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],

  GOOGLE_LATEST: "gemini-2.0-flash",
  GOOGLE_FALLBACKS: ["gemini-2.0-flash", "gemini-1.5-flash"],

  XAI_LATEST: "grok-3",
  XAI_FALLBACKS: ["grok-3", "grok-3-mini"],
} as const;

export const MODEL_REGISTRY = {
  anthropic: {
    latest: MODELS.ANTHROPIC_LATEST,
    fallbackChain: MODELS.ANTHROPIC_FALLBACKS,
    keyPattern: /^sk-ant-/,
  },
  openai: {
    latest: MODELS.OPENAI_LATEST,
    fallbackChain: MODELS.OPENAI_FALLBACKS,
    keyPattern: /^sk-[a-zA-Z0-9]{20,}$/,
  },
  google: {
    latest: MODELS.GOOGLE_LATEST,
    fallbackChain: MODELS.GOOGLE_FALLBACKS,
    keyPattern: /^AIza[a-zA-Z0-9_-]{35}$/,
  },
  xai: {
    latest: MODELS.XAI_LATEST,
    fallbackChain: MODELS.XAI_FALLBACKS,
    keyPattern: /^xai-[a-zA-Z0-9]{20,}$/,
  },
} as const;

export type Provider = keyof typeof MODEL_REGISTRY;

// ============================================================================
// PROVIDER DETECTION
// ============================================================================

export function detectProviderFromKeyPrefix(apiKey: string): Provider | null {
  if (apiKey.startsWith("sk-ant-")) return "anthropic";
  if (apiKey.startsWith("sk-")) return "openai";
  if (apiKey.startsWith("AIza")) return "google";
  if (apiKey.startsWith("xai-")) return "xai";
  return null;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface ModelClientConfig {
  apiKey: string;
  provider?: Provider;
  preferredModel?: string;
  maxRetries?: number;
  timeout?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ModelResponse {
  content: string;
  model: string;
  provider: Provider;
  tokensUsed?: {
    input: number;
    output: number;
  };
  fallbacksAttempted: string[];
}

// ============================================================================
// AI MODEL GATEWAY CLASS
// ============================================================================

export class AIModelGateway {
  private config: Required<ModelClientConfig>;
  private provider: Provider;

  constructor(config: ModelClientConfig) {
    const detectedProvider =
      config.provider || detectProviderFromKeyPrefix(config.apiKey);

    if (!detectedProvider) {
      throw new Error(
        "Could not detect provider from API key. Please specify provider explicitly."
      );
    }

    this.provider = detectedProvider;
    this.config = {
      apiKey: config.apiKey,
      provider: detectedProvider,
      preferredModel:
        config.preferredModel || MODEL_REGISTRY[detectedProvider].latest,
      maxRetries: config.maxRetries ?? 3,
      timeout: config.timeout ?? 60000,
    };
  }

  async chat(messages: ChatMessage[]): Promise<ModelResponse> {
    const registry = MODEL_REGISTRY[this.provider];
    const fallbacksAttempted: string[] = [];

    const modelChain = [
      this.config.preferredModel,
      ...registry.fallbackChain.filter(
        (m: string) => m !== this.config.preferredModel
      ),
    ];

    let lastError: Error | null = null;

    for (const model of modelChain.slice(0, this.config.maxRetries + 1)) {
      try {
        console.log(`[AIGateway] Attempting ${this.provider}/${model}...`);
        const response = await this.makeRequest(model, messages);

        return {
          ...response,
          model,
          provider: this.provider,
          fallbacksAttempted,
        };
      } catch (error) {
        lastError = error as Error;
        fallbacksAttempted.push(model);
        console.warn(
          `[AIGateway] ${model} failed: ${lastError.message}. Trying next...`
        );
      }
    }

    throw new Error(
      `All models failed for ${this.provider}. ` +
        `Attempted: ${fallbacksAttempted.join(" -> ")}. ` +
        `Last error: ${lastError?.message}`
    );
  }

  private async makeRequest(
    model: string,
    messages: ChatMessage[]
  ): Promise<Omit<ModelResponse, "model" | "provider" | "fallbacksAttempted">> {
    switch (this.provider) {
      case "anthropic":
        return this.callAnthropic(model, messages);
      case "openai":
        return this.callOpenAI(model, messages);
      case "google":
        return this.callGoogle(model, messages);
      case "xai":
        return this.callXAI(model, messages);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private async callAnthropic(
    model: string,
    messages: ChatMessage[]
  ): Promise<Omit<ModelResponse, "model" | "provider" | "fallbacksAttempted">> {
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemMessage?.content || "",
        messages: chatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${error}`);
    }

    const data = await response.json();

    return {
      content: data.content[0].text,
      tokensUsed: {
        input: data.usage?.input_tokens,
        output: data.usage?.output_tokens,
      },
    };
  }

  private async callOpenAI(
    model: string,
    messages: ChatMessage[]
  ): Promise<Omit<ModelResponse, "model" | "provider" | "fallbacksAttempted">> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 4096,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      tokensUsed: {
        input: data.usage?.prompt_tokens,
        output: data.usage?.completion_tokens,
      },
    };
  }

  private async callGoogle(
    model: string,
    messages: ChatMessage[]
  ): Promise<Omit<ModelResponse, "model" | "provider" | "fallbacksAttempted">> {
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: systemMessage
            ? { parts: [{ text: systemMessage.content }] }
            : undefined,
          contents: chatMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            maxOutputTokens: 4096,
          },
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google API error (${response.status}): ${error}`);
    }

    const data = await response.json();

    return {
      content: data.candidates[0].content.parts[0].text,
      tokensUsed: {
        input: data.usageMetadata?.promptTokenCount,
        output: data.usageMetadata?.candidatesTokenCount,
      },
    };
  }

  private async callXAI(
    model: string,
    messages: ChatMessage[]
  ): Promise<Omit<ModelResponse, "model" | "provider" | "fallbacksAttempted">> {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 4096,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`xAI API error (${response.status}): ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      tokensUsed: {
        input: data.usage?.prompt_tokens,
        output: data.usage?.completion_tokens,
      },
    };
  }

  getProvider(): Provider {
    return this.provider;
  }

  getCurrentModel(): string {
    return this.config.preferredModel;
  }
}
