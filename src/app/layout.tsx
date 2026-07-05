import type { Metadata } from "next";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { AuthActions } from "@/components/auth-actions";
import { Navigation } from "@/components/navigation";
import { isAuthEnabled } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "営業初心者伴走AI",
  description: "日報を、次の一手に変える営業支援AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="sticky top-0 z-40 border-b border-white/60 bg-paper/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-white shadow-sm">
                <Sprout className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold tracking-tight text-ink sm:text-base">
                  営業初心者伴走AI
                </span>
                <span className="hidden text-[10px] font-semibold tracking-[0.15em] text-slate-400 sm:block">
                  SALES COMPANION
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Navigation />
              <AuthActions enabled={isAuthEnabled()} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          {children}
        </main>

        <footer className="mx-auto max-w-[1440px] px-5 pb-10 pt-4 text-center text-xs text-slate-400 md:px-8">
          AIの提案は補助情報です。最終判断と顧客への連絡は担当者が行ってください。
        </footer>
      </body>
    </html>
  );
}
