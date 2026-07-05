import { describe, expect, it } from "vitest";
import { MockSalesAiProvider } from "./mock";

describe("MockSalesAiProvider", () => {
  const provider = new MockSalesAiProvider();

  it("決裁に関する日報をクロージング提案として分類する", async () => {
    const result = await provider.analyze({
      customerName: "A社",
      content:
        "見積内容は問題なく、来週の稟議に向けて決裁者へ説明する予定とのこと。",
    });

    expect(result.analysis.suggestionType).toBe("closing");
    expect(result.analysis.progressStage).toBe("クロージング間近");
  });

  it("返信がない案件を放置リスクとして分類する", async () => {
    const result = await provider.analyze({
      customerName: "B社",
      content:
        "提案後しばらく返信がない。次回の打ち合わせ予定もまだ決まっていない。",
    });

    expect(result.analysis.suggestionType).toBe("neglected");
    expect(result.analysis.progressStage).toBe("放置リスクあり");
  });
});
