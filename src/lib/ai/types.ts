import { z } from "zod";

export const progressStageValues = [
  "初期接触",
  "検討中",
  "クロージング間近",
  "放置リスクあり",
] as const;

export const suggestionTypeValues = [
  "follow",
  "closing",
  "neglected",
] as const;

export const analysisSchema = z.object({
  progressStage: z.enum(progressStageValues),
  temperatureScore: z.number().int().min(1).max(5),
  interestScore: z.number().int().min(1).max(5),
  urgencyScore: z.number().int().min(1).max(5),
  suggestionType: z.enum(suggestionTypeValues),
  nextAction: z.string().min(10).max(500),
  talkScript: z.string().min(10).max(1000).nullable(),
  analysisReason: z.string().min(10).max(500),
});

export type SalesAnalysis = z.infer<typeof analysisSchema>;

export const reportInputSchema = z.object({
  customerName: z
    .string()
    .trim()
    .max(100, "顧客名は100文字以内で入力してください")
    .optional()
    .transform((value) => value || undefined),
  content: z
    .string()
    .trim()
    .min(10, "日報本文は10文字以上で入力してください")
    .max(5000, "日報本文は5000文字以内で入力してください"),
});

export type ReportInput = z.infer<typeof reportInputSchema>;

export type ProviderResult = {
  analysis: SalesAnalysis;
  provider: "mock" | "openai" | "anthropic";
  model: string;
};

export interface SalesAiProvider {
  readonly name: ProviderResult["provider"];
  readonly model: string;
  analyze(input: ReportInput, signal?: AbortSignal): Promise<ProviderResult>;
}

export const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    progressStage: {
      type: "string",
      enum: progressStageValues,
      description: "現在の商談進捗",
    },
    temperatureScore: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      description: "興味度と緊急度を総合した温度感",
    },
    interestScore: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      description: "顧客の興味度",
    },
    urgencyScore: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      description: "顧客の緊急度",
    },
    suggestionType: {
      type: "string",
      enum: suggestionTypeValues,
      description: "follow、closing、neglectedのいずれか",
    },
    nextAction: {
      type: "string",
      description: "期限、連絡手段、目的を含む具体的な次アクション",
    },
    talkScript: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description: "そのまま使える短いトークまたはメール文案",
    },
    analysisReason: {
      type: "string",
      description: "日報のどの記述から判断したかを含む短い理由",
    },
  },
  required: [
    "progressStage",
    "temperatureScore",
    "interestScore",
    "urgencyScore",
    "suggestionType",
    "nextAction",
    "talkScript",
    "analysisReason",
  ],
} as const;
