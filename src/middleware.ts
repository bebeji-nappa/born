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
    // BASIC認証のチェック
    const basicAuth = request.headers.get('authorization');
    console.log('authorizationヘッダを確認😎', basicAuth);

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [username, password] = Buffer.from(authValue, 'base64')
        .toString()
        .split(':');
      console.log('認証情報確認😲', authValue, username, password);

      if (
        username === process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME &&
        password === process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD
      ) {
        // BASIC認証に成功した場合、アクセスを許可する
        return NextResponse.next();
      }
    }

    // BASIC認証に失敗した場合、エラーを表示する
    console.log('認証失敗🙃');
    return NextResponse.json(
      { error: 'Basic Auth Required' },
      {
        // eslint-disable-next-line quotes
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
        status: 401,
      },
    );
  }

  // 制限なしまたは許可されたIPの場合は通常処理を続行
  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/post/create', '/post/:path*/edit'],
};
