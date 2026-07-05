"use client";

import { useState } from "react";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import type { ReportDto } from "@/lib/reports";
import { AnalysisCard } from "./analysis-card";
import { ReportForm } from "./report-form";

export function DashboardClient({
  initialReport,
}: {
  initialReport: ReportDto | null;
}) {
  const [report, setReport] = useState<ReportDto | null>(initialReport);

  return (
    <>
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-forest shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            人が最終判断する営業伴走AI
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.04em] text-ink md:text-6xl">
            日報を、
            <span className="relative whitespace-nowrap text-forest">
              次の一手
              <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-apricot/45 md:bottom-2 md:h-4" />
            </span>
            に変える。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            商談メモを入力するだけで、進捗・温度感・いま取るべき行動を整理します。
          </p>
        </div>
        <div className="hidden items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm md:flex">
          <ClipboardCheck className="h-5 w-5 text-forest" />
          日報入力 → 約10秒で提案
        </div>
      </div>

      <div className="grid items-start gap-7 xl:grid-cols-[0.82fr_1.18fr]">
        <ReportForm onCreated={setReport} />
        {report ? (
          <AnalysisCard report={report} />
        ) : (
          <div className="flex min-h-[560px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-8 text-center">
            <div>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-forest">
                <ClipboardCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-ink">
                分析結果がここに表示されます
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                左のフォームへ今日の商談内容を入力してください。
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
