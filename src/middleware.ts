import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // IP制限が必要なパス
  const restrictedPaths = ['/signin', '/post/create'];

  // 動的ルート /post/[id]/edit のチェック
  const isPostEditPath = /^\/post\/[^\/]+\/edit$/.test(pathname);

  // IP制限が必要かチェック
  const isRestricted = restrictedPaths.includes(pathname) || isPostEditPath;

  if (isRestricted) {
    // IP_WHITE_LIST環境変数から許可IPを取得
    const whitelistIps =
      process.env.NEXT_PUBLIC_IP_WHITE_LIST?.split(',').map((ip) =>
        ip.trim(),
      ) || [];

    // クライアントIPを取得
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp =
      forwardedFor?.split(',')[0]?.split('::')[0]?.trim() ||
      realIp ||
      request.headers.get('x-client-ip') ||
      '127.0.0.1';

    // IPが許可リストに含まれているかチェック
    if (!clientIp || !whitelistIps.includes(clientIp)) {
      console.log('Access denied for IP:', clientIp);
      // アクセス拒否
      return new NextResponse('Access Forbidden', { status: 403 });
    }
  }

  // 制限なしまたは許可されたIPの場合は通常処理を続行
  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/post/create', '/post/:path*/edit'],
};
