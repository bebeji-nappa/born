import { ImageResponse } from "@vercel/og";
import { Noto_Sans_Javanese } from "next/font/google";

export const runtime = "edge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const font = Noto_Sans_Javanese({
  weight: "700",
  subsets: ["latin"],
});

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  userId: string;
  blogId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
}

interface Blog {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  userId: string;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error("Failed to fetch post for OG image:", error);
    return null;
  }
}

async function getBlog(id: number): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);

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
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "black",
          color: "white",
          fontSize: 60,
          fontWeight: 700,
        }}
      >
        Post not found
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }

  const blog = await getBlog(post.blogId);

  let bgColor = "#dae2e6";
  if (blog?.theme) {
    try {
      const theme = JSON.parse(blog.theme);
      bgColor = theme.backgroundColor || "#dae2e6";
    } catch {
      // JSONパースに失敗した場合はデフォルト値を使用
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
        className={font.className}
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
          fontSize: 60,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <span
            style={{
              display: "block",
              marginTop: "auto",
              textAlign: "center",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.title}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 40,
              marginLeft: "auto",
              marginTop: "auto",
            }}
          >
            {post.user.image && (
              <img
                src={post.user.image}
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
            <span>{post.user.name}</span>
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
