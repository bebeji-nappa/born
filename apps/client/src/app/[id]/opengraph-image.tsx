import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface User {
  id: string;
  email: string;
  name: string;
  screenName: string;
  image?: string;
}

interface Blog {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  userId: string;
}

async function getUserByScreenName(screenName: string): Promise<User | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/by-screen-name/${screenName}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Failed to fetch user for OG image:", error);
    return null;
  }
}

async function getBlogByUserId(userId: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/user/${userId}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error("Failed to fetch blog for OG image:", error);
    return null;
  }
}

async function loadGoogleFont() {
  const url =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap";
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

  throw new Error("failed to load font data");
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: screenName } = await params;
  const user = await getUserByScreenName(screenName);

  if (!user) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#dae2e6",
          color: "white",
          fontSize: 60,
          fontWeight: 700,
        }}
      >
        User not found
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }

  const blog = await getBlogByUserId(user.id);

  let bgColor = "#dae2e6";
  let blogTitle = `${user.name}のブログ`;
  let blogDescription = `${user.name}のブログです。`;

  if (blog) {
    if (blog.title) {
      blogTitle = blog.title;
    }
    if (blog.description) {
      blogDescription = blog.description;
    }
    if (blog.theme) {
      try {
        const theme = JSON.parse(blog.theme);
        bgColor = theme.backgroundColor || "#dae2e6";
      } catch {
        // JSONパースに失敗した場合はデフォルト値を使用
      }
    }
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: bgColor,
      }}
    >
      <div
        style={{
          display: "flex",
          background: "white",
          width: "90%",
          height: "90%",
          borderRadius: 30,
          padding: "50px",
          textAlign: "left",
          justifyContent: "center",
          alignItems: "center",
          color: "#262626",
          fontSize: 50,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            gap: "20px",
          }}
        >
          <span
            style={{
              display: "block",
              marginTop: "auto",
              textAlign: "left",
              width: "100%",
              fontSize: 60,
              lineHeight: 1.2,
            }}
          >
            {blogTitle}
          </span>
          <span
            style={{
              display: "block",
              textAlign: "left",
              width: "100%",
              fontSize: 36,
              color: "#666",
              fontWeight: 400,
            }}
          >
            {blogDescription}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              fontSize: 40,
              marginTop: "auto",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {user.image && (
                <img
                  src={user.image}
                  alt="avatar"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    verticalAlign: "middle",
                    marginRight: 10,
                  }}
                />
              )}
              <span>{user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJP",
          data: await loadGoogleFont(),
          style: "normal",
        },
      ],
    },
  );
}
