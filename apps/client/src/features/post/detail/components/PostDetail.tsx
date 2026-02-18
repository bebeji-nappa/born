"use client";

import styled from "@emotion/styled";
import { Richmd } from "@richmd/react";
import dayjs from "dayjs";
import type { FC } from "react";
import type { Post, User } from "@/lib/api";
// biome-ignore lint/style/noNonNullAssertion: ignore
import "@richmd/react/dist/richmd.css";
import Link from "next/link";

type Blog = {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  userId: string;
};

type ThemeConfig = {
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  sectionBackgroundColor?: string;
  backgroundRepeat?: boolean;
};

const Background = styled.div<{
  bgColor?: string;
  bgImage?: string;
  bgRepeat?: boolean;
}>`
  background: ${(props) => {
    if (props.bgImage) {
      const repeat = props.bgRepeat ? "repeat" : "no-repeat";
      const size = props.bgRepeat ? "auto" : "cover";
      return `url(${props.bgImage}) center/${size} ${repeat}`;
    }
    return props.bgColor || "#dae2e6";
  }};
  min-height: calc(100vh - (60px + 46px));
  position: relative;
  padding-bottom: 46px;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 0;

  @media (max-width: 860px) {
    padding: 16px 16px 0;
  }
`;

const BlogInfoSection = styled.div<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor || "#fff"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 36px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 860px) {
    padding: 20px;
    margin-bottom: 16px;
  }
`;

const BlogInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const BlogTitle = styled.h2<{ textColor?: string }>`
  font-weight: 600;
  color: ${(props) => props.textColor || "#111827"};
  font-size: 1.75rem;
  margin: 0;

  @media (max-width: 860px) {
    font-size: 1rem;
  }
`;

const BlogDescription = styled.p<{ textColor?: string }>`
  font-size: 1rem;
  color: ${(props) => props.textColor || "#6b7280"};
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;

  @media (max-width: 860px) {
    font-size: 0.8125rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100%;

  @media (max-width: 860px) {
    padding: 16px;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  min-height: calc(60vh - 48px);
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Article = styled.article<{ bgColor?: string }>`
  height: 100%;
  background-color: ${(props) => props.bgColor || "#fff"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
`;

const Header = styled.header`
  padding: 32px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 860px) {
    padding: 24px 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Title = styled.h1<{ textColor?: string }>`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${(props) => props.textColor || "#111827"};
  margin: 0;

  @media (max-width: 860px) {
    font-size: 2rem;
  }
`;

const DateSection = styled.div<{ textColor?: string }>`
  font-size: 0.875rem;
  color: ${(props) => props.textColor || "#9ca3af"};
  margin-top: 8px;
  opacity: 0.7;
`;

const AuthorProfile = styled.aside<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor || "#fff"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 32px;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 18px;
  height: fit-content;
  position: sticky;
  top: 79px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.bgColor === "transparent" ? "rgba(255, 255, 255, 0.1)" : "#f9fafb"};
  }

  @media (max-width: 860px) {
    padding: 24px;
    position: static;
  }
`;

const AuthorAvatar = styled.div`
  height: 70px;
  width: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 2rem;
  overflow: hidden;
  flex-shrink: 0;
`;

const AuthorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AuthorName = styled.h2<{ textColor?: string }>`
  font-weight: 600;
  color: ${(props) => props.textColor || "#111827"};
  font-size: 1.25rem;
  margin: 0;
`;

const AuthorBio = styled.p<{ textColor?: string }>`
  font-size: 0.875rem;
  color: ${(props) => props.textColor || "#6b7280"};
  line-height: 1.6;
  margin: 0;
`;

const AuthorProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const Content = styled.div<{ textColor?: string; linkColor?: string }>`
  padding: 32px;
  min-height: 100%;

  @media (max-width: 860px) {
    padding: 24px 20px;
  }

  .richmd {
    line-height: 1.7;
    color: ${(props) => props.textColor || "#374151"};

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${(props) => props.textColor || "#111827"};
      margin-bottom: 1em;
      font-weight: 600;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5em 0;
    }

    a {
      color: ${(props) => props.linkColor || "#3b82f6"};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Footer = styled.footer`
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  padding: 16px;
  font-size: 0.75rem;
`;

export type PostDetailProps = {
  post: Pick<Post, "id" | "title" | "content"> & {
    createdAt: string;
    user: Omit<User, "emailVerified">;
  };
  blog: Blog | null;
  authUserEmail: string | null | undefined;
};

const PostDetail: FC<PostDetailProps> = ({
  post: { title, content, user, createdAt },
  blog,
}) => {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const defaultTheme: ThemeConfig = {
    backgroundColor: "#dae2e6",
    textColor: "#374151",
    linkColor: "#3b82f6",
    sectionBackgroundColor: "#ffffff",
    backgroundRepeat: false,
  };

  let theme: ThemeConfig = { ...defaultTheme };

  if (blog?.theme) {
    try {
      const parsedTheme = JSON.parse(blog.theme) as ThemeConfig;
      theme = {
        backgroundColor:
          parsedTheme.backgroundColor || defaultTheme.backgroundColor,
        textColor: parsedTheme.textColor || defaultTheme.textColor,
        linkColor: parsedTheme.linkColor || defaultTheme.linkColor,
        sectionBackgroundColor:
          parsedTheme.sectionBackgroundColor ||
          defaultTheme.sectionBackgroundColor,
        backgroundRepeat:
          parsedTheme.backgroundRepeat ?? defaultTheme.backgroundRepeat,
      };
    } catch {
      // JSONパースに失敗した場合はデフォルト値を使用
    }
  }

  // 環境に応じて背景画像URLを変換
  const getBackgroundImageUrl = (
    url: string | null | undefined,
  ): string | undefined => {
    if (!url) return undefined;

    // ローカル開発環境の場合、APIサーバー経由のURLに変換
    if (
      process.env.NODE_ENV === "development" &&
      url.includes("storage-dev.bebeji-nappa.com")
    ) {
      const key = url.split(".com/")[1];
      return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/background-image/${key}`;
    }

    return url;
  };

  const backgroundImageUrl = getBackgroundImageUrl(blog?.backgroundImage);

  return (
    <>
      <Background
        bgColor={theme.backgroundColor}
        bgImage={backgroundImageUrl}
        bgRepeat={theme.backgroundRepeat}
      >
        <PageContainer>
          <BlogInfoSection bgColor={theme.sectionBackgroundColor}>
            <BlogInfo>
              <Link
                href={`/${user.screen_name}`}
                style={{ textDecoration: "none" }}
              >
                <BlogTitle textColor={theme.textColor}>
                  {blog?.title || `${user.name}のページ`}
                </BlogTitle>
              </Link>
              <BlogDescription textColor={theme.textColor}>
                {blog?.description || `${user.name}のページです。`}
              </BlogDescription>
            </BlogInfo>
          </BlogInfoSection>
        </PageContainer>
        <Container>
          <TwoColumnLayout>
            <Article bgColor={theme.sectionBackgroundColor}>
              <Header>
                <HeaderContent>
                  <Title textColor={theme.textColor}>{title}</Title>
                  <DateSection textColor={theme.textColor}>
                    公開日:{" "}
                    {dayjs(
                      typeof createdAt === "number"
                        ? createdAt * 1000
                        : createdAt,
                    ).format("YYYY年MM月DD日")}
                  </DateSection>
                </HeaderContent>
              </Header>
              <Content textColor={theme.textColor} linkColor={theme.linkColor}>
                <Richmd text={content} useSlideMode={false} />
              </Content>
            </Article>
            <AuthorProfile bgColor={theme.sectionBackgroundColor}>
              <AuthorAvatar>
                {user.image ? (
                  <AuthorImage src={user.image} alt={user.name || "Author"} />
                ) : (
                  getInitials(user.name)
                )}
              </AuthorAvatar>
              <AuthorProfileDetail>
                <AuthorName textColor={theme.textColor}>
                  {user.name || "Unknown Author"}
                </AuthorName>
                <AuthorBio textColor={theme.textColor}>
                  {user.description || ""}
                </AuthorBio>
              </AuthorProfileDetail>
            </AuthorProfile>
          </TwoColumnLayout>
        </Container>
      </Background>
      <Footer>powered by Born</Footer>
    </>
  );
};

export default PostDetail;
