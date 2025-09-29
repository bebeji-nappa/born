import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
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

export async function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 1200, height: 630 },
      id: "og",
    },
  ];
}

export default async function Image({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

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

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#ffd600",
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
    },
  );
}
