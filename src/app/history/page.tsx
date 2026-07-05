import { HistoryList } from "@/components/history-list";
import { db } from "@/lib/db";
import { toReportDto } from "@/lib/reports";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const reports = await db.report.findMany({
    where: { userId: "local" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <div className="mb-9">
        <p className="mb-2 text-sm font-bold text-forest">REPORT HISTORY</p>
        <h1 className="text-4xl font-bold tracking-[-0.035em] text-ink">
          分析履歴
        </h1>
        <p className="mt-3 text-base text-slate-500">
          過去の日報と、AIが提案した次のアクションを確認できます。
        </p>
      </div>
      <HistoryList reports={reports.map(toReportDto)} />
    </>
  );
}
