import type {
  ProviderResult,
  ReportInput,
  SalesAiProvider,
  SalesAnalysis,
} from "../types";

const containsAny = (text: string, words: string[]) =>
  words.some((word) => text.includes(word));

export class MockSalesAiProvider implements SalesAiProvider {
  readonly name = "mock" as const;
  readonly model = "sales-rule-demo-v1";

  async analyze(
    input: ReportInput,
    signal?: AbortSignal,
  ): Promise<ProviderResult> {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, 450);
      signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );
    });

    const text = `${input.customerName ?? ""} ${input.content}`;
    const customer = input.customerName || "先方";
    let analysis: SalesAnalysis;

    if (
      containsAny(text, [
        "返信がない",
        "返事がない",
        "連絡がない",
        "放置",
        "しばらく",
        "1か月",
        "1ヶ月",
        "次回未定",
      ])
    ) {
      analysis = {
        progressStage: "放置リスクあり",
        temperatureScore: 2,
        interestScore: 2,
        urgencyScore: 2,
        suggestionType: "neglected",
        nextAction: `明日の午前中に${customer}へ短いメールを送り、検討状況と再開時期を二択で確認する。3営業日以内に返信がなければ、一度クローズする旨を丁寧に伝える。`,
        talkScript: `ご検討状況はいかがでしょうか。今月中に一度お打ち合わせするか、来月以降に改めてご連絡するか、進めやすい方をお知らせいただけますと幸いです。`,
        analysisReason:
          "返信や次回予定が確定していない記述があり、自然消滅を防ぐための再接触が必要です。",
      };
    } else if (
      containsAny(text, [
        "決裁",
        "稟議",
        "見積",
        "契約",
        "導入時期",
        "最終",
        "発注",
      ])
    ) {
      analysis = {
        progressStage: "クロージング間近",
        temperatureScore: 4,
        interestScore: 4,
        urgencyScore: 4,
        suggestionType: "closing",
        nextAction: `明日午前中に${customer}へ電話し、決裁に必要な条件と残っている懸念を確認する。そのうえで、決裁者同席の30分の最終確認ミーティングを今週中に提案する。`,
        talkScript: `ご検討を前に進めるため、社内決裁で必要な情報と残っているご懸念を整理させてください。可能であれば、決裁に関わる方にもご同席いただき、今週30分ほど最終確認のお時間をいただけますか。`,
        analysisReason:
          "決裁・見積・契約など、購入判断に近い具体的な要素が日報に含まれています。",
      };
    } else if (
      containsAny(text, ["初回", "初めて", "問い合わせ", "挨拶", "名刺"])
    ) {
      analysis = {
        progressStage: "初期接触",
        temperatureScore: 3,
        interestScore: 3,
        urgencyScore: 2,
        suggestionType: "follow",
        nextAction: `明日中に${customer}へお礼メールを送り、現在の課題・導入希望時期・意思決定に関わる方の3点を確認する次回30分の打ち合わせを提案する。`,
        talkScript: `本日はありがとうございました。より具体的なご提案のため、現在の課題と導入時期、社内でご判断に関わる方について、次回30分ほどお伺いできればと思います。`,
        analysisReason:
          "初回接点の段階であり、提案前に課題と意思決定プロセスを確認する必要があります。",
      };
    } else {
      analysis = {
        progressStage: "検討中",
        temperatureScore: 3,
        interestScore: 4,
        urgencyScore: 2,
        suggestionType: "follow",
        nextAction: `明日午前中に${customer}へ連絡し、検討上の懸念と社内調整の進み具合を確認する。決裁者が参加できる次回打ち合わせを今週中に設定する。`,
        talkScript: `先日はありがとうございました。ご検討にあたり、追加で必要な情報やご懸念はありますか。可能でしたら、次回はご判断に関わる方にもご参加いただき、具体的な進め方を整理できればと思います。`,
        analysisReason:
          "関心を示す記述はある一方、判断条件や次回予定が確定していないため、フォローが適切です。",
      };
    }

    return {
      analysis,
      provider: this.name,
      model: this.model,
    };
  }
}
