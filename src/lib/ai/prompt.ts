import type { ReportInput } from "./types";
import { BASE_SALES_KNOWLEDGE } from "./sales-knowledge";

export function buildSystemPrompt(): string {
  return `
あなたは営業経験1〜3年の担当者に伴走する、日本の法人営業コーチです。
日報の記述だけを根拠に商談状況を分析し、次に取るべき行動を提案してください。

${BASE_SALES_KNOWLEDGE}

スコア基準:
- 1: ほとんど兆候がない
- 2: 弱い
- 3: 中程度
- 4: 高い
- 5: 非常に高い

temperatureScoreはinterestScoreとurgencyScoreを参考に、商談全体の温度感として判定してください。
`.trim();
}

export function buildUserPrompt(input: ReportInput): string {
  return `
顧客名: ${input.customerName ?? "未入力"}

日報:
${input.content}

この日報を分析し、指定された形式で回答してください。
`.trim();
}
