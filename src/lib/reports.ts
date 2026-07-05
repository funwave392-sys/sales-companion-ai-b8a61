import type { Report } from "@prisma/client";

export type ReportDto = {
  id: string;
  customerName: string | null;
  content: string;
  createdAt: string;
  progressStage: string;
  temperatureScore: number;
  interestScore: number;
  urgencyScore: number;
  suggestionType: string;
  nextAction: string;
  talkScript: string | null;
  analysisReason: string;
  provider: string;
  model: string;
};

export function toReportDto(report: Report): ReportDto {
  return {
    ...report,
    createdAt: report.createdAt.toISOString(),
  };
}
