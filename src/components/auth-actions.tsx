"use client";

import { LogOut } from "lucide-react";

export function AuthActions({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-slate-500 transition hover:border-forest hover:text-forest"
      aria-label="ログアウト"
      title="ログアウト"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
