import { Post } from "@/lib/api";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Virtuoso } from "react-virtuoso";
// @ts-ignore-next-line
import "@richmd/react/dist/richmd.css";
import { useAuth } from "@/hooks/useAuth";

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

const BlogDetailSection = styled.div<{ bgColor?: string }>`
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

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  min-width: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  overflow: hidden;

  @media (max-width: 860px) {
    width: 50px;
    height: 50px;
    min-width: 50px;
    font-size: 1.25rem;
  }
`;

const UserImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    font-size: 1.5rem;
  }
`;

const BlogDescription = styled.p<{ textColor?: string }>`
  font-size: 1rem;
  color: ${(props) => props.textColor || "#6b7280"};
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;

  @media (max-width: 860px) {
    font-size: 0.875rem;
  }
`;

const SettingsButton = styled.button`
  padding: 8px 20px;
  background: #f5f5f5;
  color: #000;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e5e5e5;
  }

  @media (max-width: 860px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 24px;

  @media (max-width: 860px) {
    flex-direction: column;
    padding: 16px;
  }
`;

const MainContent = styled.main`
  flex: 2;
  min-width: 0;
`;

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 860px) {
    gap: 16px;
  }
`;

const EmptyStateContainer = styled.div<{ bgColor?: string }>`
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 24px;
  text-align: center;
`;

const EmptyStateCard = styled.div<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor || "#fff"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const EmptyStateTitle = styled.h2<{ textColor?: string }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.textColor || "#111827"};
  margin: 0;
`;

const EmptyStateMessage = styled.p<{ textColor?: string }>`
  font-size: 1rem;
  color: ${(props) => props.textColor || "#6b7280"};
  line-height: 1.6;
  margin: 0;
`;

const CreatePostButtonLarge = styled.button`
  padding: 12px 32px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }
`;

const Article = styled.article<{ bgColor?: string; textColor?: string }>`
  background-color: ${(props) => props.bgColor || "#fff"};
  color: ${(props) => props.textColor || "#374151"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
  cursor: pointer;
`;

const Header = styled.header`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 860px) {
    padding: 24px 20px;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px 0;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 860px) {
    font-size: 1.5rem;
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
`;

const AuthorAvatar = styled.div`
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
`;

const AuthorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span<{ textColor?: string }>`
  font-weight: 500;
  color: ${(props) => props.textColor || "#374151"};
  font-size: 1rem;
`;

const DateSection = styled.div<{ textColor?: string }>`
  font-size: 0.75rem;
  color: ${(props) => props.textColor || "#9ca3af"};
  margin-bottom: 12px;
  opacity: 0.7;
`;

const Sidebar = styled.aside`
  flex: 1;

  @media (max-width: 860px) {
    width: 100%;
  }
`;

const ProfileCard = styled.div<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor || "#fff"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: sticky;
  top: 79px;
  padding: 24px 36px;

  @media (max-width: 860px) {
    position: static;
  }
`;

const ProfileAvatar = styled.div`
  width: 70px;
  height: 70px;
  min-width: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 2rem;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileName = styled.h2<{ textColor?: string }>`
  font-weight: 600;
  color: ${(props) => props.textColor || "#111827"};
  font-size: 1.25rem;
  margin: 0;
`;

const ProfileBio = styled.p<{ textColor?: string }>`
  font-size: 0.875rem;
  color: ${(props) => props.textColor || "#6b7280"};
  line-height: 1.6;
  margin: 0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding-bottom: 32px;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 24px;
  background: ${(props) => (props.disabled ? "#e5e7eb" : "#000000")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "white")};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.disabled ? "#e5e7eb" : "#333333")};
  }
`;

const PaginationInfo = styled.span<{ textColor?: string }>`
  font-size: 0.875rem;
  color: ${(props) => props.textColor || "#6b7280"};
  font-weight: 500;
`;

const Footer = styled.footer`
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  padding: 16px;
  font-size: 0.75rem;
`;

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PostListTemplateProps = {
  posts: Post[];
  blog: Blog | null;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
};

const PostListTemplate = ({
  posts,
  blog,
  pagination,
  onPageChange,
}: PostListTemplateProps) => {
  const router = useRouter();
  const { user } = useAuth();
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

  const firstPostUser = posts.length > 0 ? posts[0].user : null;

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

  const showBlogInfo = blog !== null;
  // blog が存在し、blog.userId と user.id が一致する場合は user を使用
  const profileUser =
    firstPostUser || (blog && user && blog.userId === user.id ? user : null);

  return (
    <>
      <Background
        bgColor={theme.backgroundColor}
        bgImage={backgroundImageUrl}
        bgRepeat={theme.backgroundRepeat}
      >
        {showBlogInfo && blog && (
          <PageContainer>
            <BlogDetailSection bgColor={theme.sectionBackgroundColor}>
              <BlogInfo>
                <BlogTitle textColor={theme.textColor}>
                  {blog.title || `${profileUser?.name || ""}のページ`}
                </BlogTitle>
                <BlogDescription textColor={theme.textColor}>
                  {blog.description ||
                    `${profileUser?.name || ""}のページです。`}
                </BlogDescription>
              </BlogInfo>
              {user && profileUser && user.id === profileUser.id && (
                <SettingsButton
                  onClick={() => router.push(`/setting/blog/${blog.id}`)}
                >
                  ブログ設定
                </SettingsButton>
              )}
            </BlogDetailSection>
          </PageContainer>
        )}
        {posts.length ? (
          <ContentWrapper>
            <MainContent>
              <PostListContainer>
                {posts.map((post) => {
                  const { id, title, user, createdAt } = post;
                  return (
                    <Article
                      key={id}
                      onClick={() => router.push(`/post/${id}`)}
                      bgColor={theme.sectionBackgroundColor}
                      textColor={theme.textColor}
                    >
                      <Header>
                        <Title>{title}</Title>
                        <AuthorSection>
                          <AuthorAvatar>
                            {user.image ? (
                              <AuthorImage
                                src={user.image}
                                alt={user.name || "Author"}
                              />
                            ) : (
                              getInitials(user.name)
                            )}
                          </AuthorAvatar>
                          <AuthorInfo>
                            <AuthorName textColor={theme.textColor}>
                              {user.name || "Unknown Author"}
                            </AuthorName>
                          </AuthorInfo>
                        </AuthorSection>
                        <DateSection textColor={theme.textColor}>
                          公開日:{" "}
                          {dayjs(
                            typeof createdAt === "number"
                              ? createdAt * 1000
                              : createdAt,
                          ).format("YYYY年MM月DD日")}
                        </DateSection>
                      </Header>
                    </Article>
                  );
                })}
              </PostListContainer>
              {pagination && (
                <PaginationContainer>
                  {pagination.page > 1 && (
                    <PaginationButton
                      disabled={!pagination.hasPrev}
                      onClick={() => onPageChange(pagination.page - 1)}
                    >
                      前の10件
                    </PaginationButton>
                  )}
                  {pagination.page < pagination.totalPages && (
                    <PaginationButton
                      disabled={!pagination.hasNext}
                      onClick={() => onPageChange(pagination.page + 1)}
                    >
                      次の10件
                    </PaginationButton>
                  )}
                </PaginationContainer>
              )}
            </MainContent>
            {profileUser && (
              <Sidebar>
                <ProfileCard bgColor={theme.sectionBackgroundColor}>
                  <ProfileAvatar>
                    {profileUser.image ? (
                      <ProfileImage
                        src={profileUser.image}
                        alt={profileUser.name || "User"}
                      />
                    ) : (
                      getInitials(profileUser.name)
                    )}
                  </ProfileAvatar>
                  <ProfileWrapper>
                    <ProfileName textColor={theme.textColor}>
                      {profileUser.name || "Unknown User"}
                    </ProfileName>
                    <ProfileBio textColor={theme.textColor}>
                      {profileUser.description || ""}
                    </ProfileBio>
                  </ProfileWrapper>
                </ProfileCard>
              </Sidebar>
            )}
          </ContentWrapper>
        ) : (
          <EmptyStateContainer>
            <EmptyStateCard bgColor={theme.sectionBackgroundColor}>
              <EmptyStateTitle textColor={theme.textColor}>
                まだ投稿がありません
              </EmptyStateTitle>
              {user && profileUser && user.id === profileUser.id && (
                <>
                  <EmptyStateMessage textColor={theme.textColor}>
                    最初の記事を書いて、あなたの考えや知識を共有しましょう。
                    <br />
                    記事を投稿することで、多くの人にあなたの情報を届けることができます。
                  </EmptyStateMessage>
                  <CreatePostButtonLarge
                    onClick={() => router.push("/post/create")}
                  >
                    記事を作成
                  </CreatePostButtonLarge>
                </>
              )}
            </EmptyStateCard>
          </EmptyStateContainer>
        )}
      </Background>
      <Footer>powered by Born</Footer>
    </>
  );
};

export default PostListTemplate;
