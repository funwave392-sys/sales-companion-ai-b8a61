import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "../prompt";
import {
  analysisJsonSchema,
  analysisSchema,
  type ProviderResult,
  type ReportInput,
  type SalesAiProvider,
} from "../types";

export class AnthropicSalesProvider implements SalesAiProvider {
  readonly name = "anthropic" as const;
  readonly model: string;
  private readonly client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEYが設定されていません。.envを確認してください。",
      );
    }

    this.model =
      process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
    this.client = new Anthropic({ apiKey });
  }

  async analyze(
    input: ReportInput,
    signal?: AbortSignal,
  ): Promise<ProviderResult> {
    const response = await this.client.messages.create(
      {
        model: this.model,
        max_tokens: 1200,
        system: buildSystemPrompt(),
        messages: [{ role: "user", content: buildUserPrompt(input) }],
        tools: [
          {
            name: "submit_sales_analysis",
            description:
              "日報の営業分析結果を、アプリケーションへ構造化して返す。",
            input_schema: {
              ...analysisJsonSchema,
              required: [...analysisJsonSchema.required],
            },
          },
        ],
        tool_choice: {
          type: "tool",
          name: "submit_sales_analysis",
        },
      },
      { signal },
    );

    const toolUse = response.content.find(
      (block) =>
        block.type === "tool_use" && block.name === "submit_sales_analysis",
    );

    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("Claudeから分析結果を取得できませんでした。");
    }

    const analysis = analysisSchema.parse(toolUse.input);

    return {
      analysis,
      provider: this.name,
      model: this.model,
    };
  }
}
