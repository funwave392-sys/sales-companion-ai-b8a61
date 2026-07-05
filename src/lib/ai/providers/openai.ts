import OpenAI from "openai";
import { buildSystemPrompt, buildUserPrompt } from "../prompt";
import {
  analysisJsonSchema,
  analysisSchema,
  type ProviderResult,
  type ReportInput,
  type SalesAiProvider,
} from "../types";

export class OpenAiSalesProvider implements SalesAiProvider {
  readonly name = "openai" as const;
  readonly model: string;
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEYが設定されていません。.envを確認してください。",
      );
    }

    this.model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
    this.client = new OpenAI({ apiKey });
  }

  async analyze(
    input: ReportInput,
    signal?: AbortSignal,
  ): Promise<ProviderResult> {
    const response = await this.client.responses.create(
      {
        model: this.model,
        instructions: buildSystemPrompt(),
        input: buildUserPrompt(input),
        text: {
          format: {
            type: "json_schema",
            name: "sales_report_analysis",
            strict: true,
            schema: analysisJsonSchema,
          },
        },
      },
      { signal },
    );

    if (!response.output_text) {
      throw new Error("OpenAIから分析結果を取得できませんでした。");
    }

    const analysis = analysisSchema.parse(JSON.parse(response.output_text));

    return {
      analysis,
      provider: this.name,
      model: this.model,
    };
  }
}
