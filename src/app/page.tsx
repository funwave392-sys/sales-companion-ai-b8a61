import { DashboardClient } from "@/components/dashboard-client";
import { db } from "@/lib/db";
import { toReportDto } from "@/lib/reports";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latest = await db.report.findFirst({
    where: { userId: "local" },
    orderBy: { createdAt: "desc" },
  });

  return <DashboardClient initialReport={latest ? toReportDto(latest) : null} />;
}
