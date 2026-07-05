import { Bot, CircleDot } from "lucide-react";

const providerNames: Record<string, string> = {
  mock: "デモモード",
  openai: "OpenAI",
  anthropic: "Claude",
};

export function ProviderBadge({
  provider,
  model,
}: {
  provider: string;
  model?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
      title={model}
    >
      {provider === "mock" ? (
        <CircleDot className="h-3.5 w-3.5 text-apricot" />
      ) : (
        <Bot className="h-3.5 w-3.5 text-forest" />
      )}
      {providerNames[provider] ?? provider}
    </span>
  );
}
