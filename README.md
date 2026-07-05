# 営業初心者伴走AI

営業日報を自然文で入力すると、商談状況・温度感を分析し、次のアクションとトーク案を提案するMVPです。

## 起動

```bash
cp .env.example .env
npm install
npm run db:push
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。初期設定はAPIキー不要のデモモードです。

## AIプロバイダーの切り替え

`.env` の `AI_PROVIDER` を変更します。

```env
AI_PROVIDER=mock
# AI_PROVIDER=openai
# AI_PROVIDER=anthropic
```

- OpenAIを使う場合は `OPENAI_API_KEY` と `OPENAI_MODEL`
- Claudeを使う場合は `ANTHROPIC_API_KEY` と `ANTHROPIC_MODEL`

を設定し、開発サーバーを再起動してください。

AI固有の処理は `src/lib/ai/providers` に分離し、アプリ本体は共通の `SalesAiProvider` インターフェースだけを利用します。

## Railwayへデプロイ

本番環境ではSQLiteではなく、Railway PostgreSQLを利用します。ローカル用の
`prisma/schema.prisma` はSQLiteのまま残し、本番ビルドだけ
`prisma/schema.postgresql.prisma` を使用します。

### 1. GitHubへ登録

このフォルダをGitHubリポジトリへpushします。`.env` とローカルDBは
`.gitignore` の対象です。

### 2. Railwayプロジェクトを作成

1. Railwayで「Deploy from GitHub repo」を選択
2. このリポジトリを指定
3. 同じプロジェクトにPostgreSQLサービスを追加
4. Next.jsサービスのVariablesから、PostgreSQLの`DATABASE_URL`を参照

`railway.json` に以下を設定済みです。

- ビルド: `npm run build:railway`
- マイグレーション: `npm run db:migrate:railway`
- 起動: `npm start`
- ヘルスチェック: `/api/health`

### 3. 環境変数を設定

`.env.railway.example` を参考に、RailwayのVariablesへ登録します。

最低限必要な項目:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
AI_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.4-mini

APP_AUTH_ENABLED=true
APP_USERNAME=miyazaki
APP_PASSWORD=十分に長いパスワード
AUTH_SECRET=32文字以上のランダム文字列
```

Claudeを使用する場合は、`AI_PROVIDER=anthropic`へ変更し、
`ANTHROPIC_API_KEY`と`ANTHROPIC_MODEL`を設定します。

### 4. 公開URLを作成

RailwayのNext.jsサービスで「Settings → Networking → Generate Domain」を
選択します。公開URLへアクセスするとログイン画面が表示されます。

## Netlify + Neonへデプロイ

無料枠で試用する場合は、WebアプリをNetlify、PostgreSQLをNeonへ配置できます。

1. NeonでPostgreSQLプロジェクトを作成
2. 接続文字列を `DATABASE_URL` として設定
3. `npm run db:migrate:postgres` でテーブルを作成
4. Netlifyでこのプロジェクトをデプロイ
5. `.env.netlify.example` の環境変数をNetlifyへ設定

Netlifyでは `netlify.toml` と `npm run build:netlify` が使用されます。

## 認証について

今回追加した認証は、1〜数名でのテスト運用を想定した共有ID・パスワード方式です。
セッションCookieはHTTP Only、SameSite=Lax、本番環境ではSecureで保存されます。

本格販売時には、ユーザーごとのアカウント、パスワード再設定、操作ログ、
アクセス権限を備えた認証基盤への移行が必要です。
