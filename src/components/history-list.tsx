"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Search, UserRound } from "lucide-react";
import type { ReportDto } from "@/lib/reports";
import { AnalysisCard } from "./analysis-card";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

export function HistoryList({ reports }: { reports: ReportDto[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return reports;
    return reports.filter(
      (report) =>
        report.customerName?.toLowerCase().includes(normalized) ||
        report.content.toLowerCase().includes(normalized),
    );
  }, [query, reports]);

  const selected =
    filtered.find((report) => report.id === selectedId) ?? filtered[0] ?? null;

  if (reports.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
        <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-4 text-xl font-bold text-ink">
          まだ分析履歴がありません
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          日報を分析すると、ここに保存されます。
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-7 xl:grid-cols-[360px_1fr]">
      <aside className="rounded-[28px] border border-line bg-white p-4 shadow-soft xl:sticky xl:top-28">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="顧客名・日報を検索"
            className="w-full rounded-2xl border border-line bg-paper py-3 pl-11 pr-4 text-sm outline-none focus:border-forest focus:bg-white focus:ring-4 focus:ring-mint"
          />
        </label>

        <div className="mt-4 max-h-[65vh] space-y-2 overflow-y-auto pr-1">
          {filtered.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedId(report.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selected?.id === report.id
                  ? "border-forest bg-mint/60"
                  : "border-transparent hover:border-line hover:bg-paper"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-ink">
                <UserRound className="h-4 w-4 text-forest" />
                {report.customerName || "顧客名未入力"}
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                {report.content}
              </p>
              <p className="mt-3 text-[11px] font-medium text-slate-400">
                {formatDate(report.createdAt)}
              </p>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              該当する履歴がありません。
            </p>
          )}
        </div>
      </aside>

      {selected && <AnalysisCard report={selected} />}
    </div>
  );
}
