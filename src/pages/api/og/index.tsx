import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { Noto_Sans_Javanese } from 'next/font/google';

export const config = {
  runtime: 'edge',
};

const font = Noto_Sans_Javanese({
  weight: '700',
  subsets: ['latin'],
});

async function loadGoogleFont() {
  const url =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap';
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hasTitle = searchParams.has('title');
  const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : null;

  const user = JSON.parse(searchParams.get('user') ?? '{}') ?? {};

  console.log('user', user);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: title ? '#ffd600' : 'black',
        }}
      >
        <div
          className={font.className}
          style={{
            display: 'flex',
            background: title ? 'white' : 'black',
            width: '90%',
            height: '90%',
            borderRadius: 30,
            padding: '50px',
            textAlign: 'left',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#262626',
            fontSize: 60,
            fontWeight: 700,
            fontFamily: '"NotoSansJP"',
          }}
        >
          {title && user ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <span
                style={{
                  display: 'block',
                  marginTop: 'auto',
                  textAlign: 'center',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 40,
                  marginLeft: 'auto',
                  marginTop: 'auto',
                }}
              >
                <img
                  src={user.image}
                  alt="avatar"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    verticalAlign: 'middle',
                    marginRight: 10,
                  }}
                />
                <span>{user.name}</span>
              </div>
            </div>
          ) : (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`}
              alt="Logo"
            />
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansJP',
          data: await loadGoogleFont(),
          style: 'normal',
        },
      ],
    },
  );
}
