"use client";

import { useState } from "react";
import { KeyRound, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "ログインできませんでした。");
      }

      const requestedPath = new URLSearchParams(window.location.search).get(
        "next",
      );
      const destination =
        requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
          ? requestedPath
          : "/";
      window.location.href = destination;
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "ログインできませんでした。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-md items-center">
      <form
        onSubmit={submit}
        className="w-full rounded-[28px] border border-line bg-white p-7 shadow-soft md:p-9"
      >
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-forest">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <p className="text-sm font-bold text-forest">MEMBER LOGIN</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          営業伴走AIへログイン
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          管理者から共有されたユーザー名とパスワードを入力してください。
        </p>

        <div className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              <UserRound className="h-4 w-4 text-forest" />
              ユーザー名
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3.5 outline-none focus:border-forest focus:bg-white focus:ring-4 focus:ring-mint"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              <KeyRound className="h-4 w-4 text-forest" />
              パスワード
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3.5 outline-none focus:border-forest focus:bg-white focus:ring-4 focus:ring-mint"
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-5 py-4 font-bold text-white transition hover:bg-[#0f3d2e] disabled:opacity-60"
        >
          {loading && <LoaderCircle className="h-5 w-5 animate-spin" />}
          ログイン
        </button>
      </form>
    </div>
  );
}
