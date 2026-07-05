"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  FileText,
  LoaderCircle,
  WandSparkles,
} from "lucide-react";
import type { ReportDto } from "@/lib/reports";

const sample =
  "A社の田中様と商談。予算感は合いそうだが、決裁者との調整が必要とのこと。来月上旬の導入を希望しており、今週中に見積書が欲しいと言われた。";

export function ReportForm({
  onCreated,
}: {
  onCreated: (report: ReportDto) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, content }),
      });
      const data = (await response.json()) as {
        report?: ReportDto;
        error?: string;
      };

      if (!response.ok || !data.report) {
        throw new Error(data.error || "分析に失敗しました。");
      }

      onCreated(data.report);
      setContent("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "分析に失敗しました。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-line bg-white p-6 shadow-soft md:p-8"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-forest">NEW REPORT</p>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            今日の商談を教えてください
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            箇条書きでも話し言葉でも大丈夫です。
          </p>
        </div>
        <div className="rounded-2xl bg-mint p-3 text-forest">
          <WandSparkles className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
            <Building2 className="h-4 w-4 text-forest" />
            顧客名
            <span className="font-normal text-slate-400">任意</span>
          </span>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            maxLength={100}
            placeholder="例：A社"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-ink outline-none transition placeholder:text-slate-400 focus:border-forest focus:bg-white focus:ring-4 focus:ring-mint"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-sm font-bold text-ink">
              <FileText className="h-4 w-4 text-forest" />
              日報本文
              <span className="text-rose-500">必須</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomerName("A社");
                setContent(sample);
              }}
              className="text-xs font-bold text-forest underline decoration-mint decoration-4 underline-offset-4"
            >
              サンプルを入力
            </button>
          </div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            minLength={10}
            maxLength={5000}
            required
            rows={9}
            placeholder="例：A社の田中様と商談。予算感は合いそうだが、決裁者との調整が必要とのこと…"
            className="w-full resize-none rounded-2xl border border-line bg-paper px-4 py-4 leading-7 text-ink outline-none transition placeholder:text-slate-400 focus:border-forest focus:bg-white focus:ring-4 focus:ring-mint"
          />
          <div className="mt-2 text-right text-xs text-slate-400">
            {content.length.toLocaleString()} / 5,000
          </div>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || content.trim().length < 10}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-5 py-4 font-bold text-white transition hover:bg-[#0f3d2e] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            AIが日報を分析しています
          </>
        ) : (
          <>
            分析して次の一手を見る
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}
