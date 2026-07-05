import type { SalesAiProvider } from "./types";
import { AnthropicSalesProvider } from "./providers/anthropic";
import { MockSalesAiProvider } from "./providers/mock";
import { OpenAiSalesProvider } from "./providers/openai";

export type AiProviderName = "mock" | "openai" | "anthropic";

export function getAiProvider(
  name = process.env.AI_PROVIDER || "mock",
): SalesAiProvider {
  switch (name.toLowerCase() as AiProviderName) {
    case "openai":
      return new OpenAiSalesProvider();
    case "anthropic":
      return new AnthropicSalesProvider();
    case "mock":
      return new MockSalesAiProvider();
    default:
      throw new Error(
        `未対応のAI_PROVIDERです: ${name}。mock / openai / anthropicを指定してください。`,
      );
  }
}
