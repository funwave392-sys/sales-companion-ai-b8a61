import {
  ArrowUpRight,
  Flame,
  Lightbulb,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import type { ReportDto } from "@/lib/reports";
import { ProviderBadge } from "./provider-badge";

const suggestionLabels: Record<string, string> = {
  follow: "フォロー提案",
  closing: "クロージング提案",
  neglected: "放置案件への対応",
};

const suggestionStyles: Record<string, string> = {
  follow: "bg-sky-50 text-sky-700 border-sky-200",
  closing: "bg-orange-50 text-orange-700 border-orange-200",
  neglected: "bg-rose-50 text-rose-700 border-rose-200",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-ink">{value}/5</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-forest transition-all duration-500"
          style={{ width: `${value * 20}%` }}
        />
      </div>
    </div>
  );
}

export function AnalysisCard({ report }: { report: ReportDto }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
      <div className="border-b border-line bg-gradient-to-br from-mint/70 to-white px-6 py-5 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-forest">
              <Sparkles className="h-4 w-4" />
              AI分析結果
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              {report.customerName || "顧客名未入力"}の商談
            </h2>
          </div>
          <ProviderBadge provider={report.provider} model={report.model} />
        </div>
      </div>

      <div className="space-y-7 p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              商談進捗
            </div>
            <div className="text-xl font-bold text-ink">
              {report.progressStage}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              <Flame className="h-4 w-4 text-apricot" />
              総合温度感
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-ink">
                {report.temperatureScore}
              </span>
              <span className="pb-1 text-sm font-semibold text-slate-500">
                / 5
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 rounded-2xl border border-line p-5 sm:grid-cols-2">
          <ScoreBar label="興味度" value={report.interestScore} />
          <ScoreBar label="緊急度" value={report.urgencyScore} />
        </div>

        <div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
              suggestionStyles[report.suggestionType] ??
              "border-line bg-paper text-slate-600"
            }`}
          >
            {suggestionLabels[report.suggestionType] ?? report.suggestionType}
          </span>
        </div>

        <div className="rounded-2xl bg-forest p-6 text-white">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-mint">
            <ArrowUpRight className="h-4 w-4" />
            次に取るべきアクション
          </div>
          <p className="text-lg font-semibold leading-8">{report.nextAction}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line p-5">
            <div className="mb-3 flex items-center gap-2 font-bold text-ink">
              <Lightbulb className="h-5 w-5 text-apricot" />
              判断理由
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {report.analysisReason}
            </p>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <div className="mb-3 flex items-center gap-2 font-bold text-ink">
              <MessageSquareText className="h-5 w-5 text-forest" />
              トーク・メール案
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {report.talkScript || "今回はトーク案の生成対象外です。"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
