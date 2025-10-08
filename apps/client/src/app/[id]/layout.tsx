import { Metadata } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Blog = {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  userId: string;
};

type User = {
  id: string;
  name: string;
  screen_name: string | null;
};

async function getUserByScreenName(screenName: string): Promise<User | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/by-screen-name/${screenName}`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

async function getBlogByUserId(userId: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/user/${userId}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: screenName } = await params;
  const user = await getUserByScreenName(screenName);

  if (!user) {
    return {
      title: "User not found",
    };
  }

  const blog = await getBlogByUserId(user.id);

  const title = blog?.title || `${user.name}のブログ`;
  const description = blog?.description || `${user.name}のブログです。`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/${screenName}/opengraph-image`;

  return {
    title: `${title} | Born`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function UserBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
