import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // BASIC認証を除外するパス（投稿詳細とブログトップページ以外を保護）
  const publicPaths = [
    "/api/", // APIルート
    "/_next/", // Next.jsの内部リソース
    "/favicon.ico",
    "/opengraph-image",
    "/born_logo.svg",
  ];

  // 投稿詳細ページ (/post/[id]) - editは除外
  const isPostDetailPage =
    pathname.startsWith("/post/") && !pathname.includes("/edit");

  // ブログトップページのパターン (/[screen_name])
  // ルートページと管理系ページを除外
  const isBlogTopPage =
    pathname !== "/" &&
    !pathname.startsWith("/post") &&
    !pathname.startsWith("/setting") &&
    !pathname.startsWith("/setup") &&
    !pathname.startsWith("/signin") &&
    !pathname.startsWith("/signup") &&
    !pathname.startsWith("/verify-email") &&
    !pathname.startsWith("/blocked") &&
    !pathname.startsWith("/api") &&
    pathname.split("/").filter((p) => p).length === 1;

  // 公開ページかどうか判定
  const isPublicPath =
    publicPaths.some((path) => pathname.startsWith(path)) ||
    isPostDetailPage ||
    isBlogTopPage;

  // 公開ページの場合はBASIC認証をスキップ
  if (isPublicPath) {
    return NextResponse.next();
  }

  // BASIC認証の実装
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // 環境変数から認証情報を取得
    const validUser = process.env.BASIC_AUTH_USER || "admin";
    const validPassword = process.env.BASIC_AUTH_PASSWORD || "password";

    if (user === validUser && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  // 認証が必要
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
