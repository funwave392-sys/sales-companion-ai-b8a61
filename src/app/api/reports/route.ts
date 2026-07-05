import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAiProvider } from "@/lib/ai";
import { reportInputSchema } from "@/lib/ai/types";
import { db } from "@/lib/db";
import { toReportDto } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const reports = await db.report.findMany({
    where: { userId: "local" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    reports: reports.map(toReportDto),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = reportInputSchema.parse(body);
    const provider = getAiProvider();
    const signal = AbortSignal.timeout(9_500);
    const result = await provider.analyze(input, signal);

    const report = await db.report.create({
      data: {
        userId: "local",
        customerName: input.customerName ?? null,
        content: input.content,
        progressStage: result.analysis.progressStage,
        temperatureScore: result.analysis.temperatureScore,
        interestScore: result.analysis.interestScore,
        urgencyScore: result.analysis.urgencyScore,
        suggestionType: result.analysis.suggestionType,
        nextAction: result.analysis.nextAction,
        talkScript: result.analysis.talkScript,
        analysisReason: result.analysis.analysisReason,
        provider: result.provider,
        model: result.model,
      },
    });

    return NextResponse.json({ report: toReportDto(report) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "入力内容を確認してください。",
        },
        { status: 400 },
      );
    }

    if (
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return NextResponse.json(
        {
          error:
            "AIの応答がタイムアウトしました。時間をおいて再度お試しください。",
        },
        { status: 504 },
      );
    }

    console.error("Failed to create report", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "分析中にエラーが発生しました。",
      },
      { status: 500 },
    );
  }
}
