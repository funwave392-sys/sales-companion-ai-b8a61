-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'local',
    "customerName" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progressStage" TEXT NOT NULL,
    "temperatureScore" INTEGER NOT NULL,
    "interestScore" INTEGER NOT NULL,
    "urgencyScore" INTEGER NOT NULL,
    "suggestionType" TEXT NOT NULL,
    "nextAction" TEXT NOT NULL,
    "talkScript" TEXT,
    "analysisReason" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_userId_createdAt_idx" ON "Report"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Report_customerName_idx" ON "Report"("customerName");
