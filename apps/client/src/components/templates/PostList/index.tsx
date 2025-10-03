import { Post } from "@/lib/api";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { VirtuosoGrid } from "react-virtuoso";
// @ts-ignore-next-line
import "@richmd/react/dist/richmd.css";

const Background = styled.div`
  background: #dae2e6;
  min-height: calc(100vh - 55px);
  position: relative;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 0;

  @media (max-width: 768px) {
    padding: 16px 16px 0;
  }
`;

const UserProfileSection = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 36px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
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

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const UserName = styled.h2`
  font-weight: 600;
  color: #111827;
  font-size: 1.75rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const UserDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  grid-template-rows: auto;

  @media (max-width: 768px) {
    padding: 16px;
    grid-template-columns: repeat(1, minmax(300px, 1fr));
    gap: 16px;
  }
`;

const EmptyMessage = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const Article = styled.article`
  background-color: #fff;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
  cursor: pointer;
`;

const Header = styled.header`
  padding: 32px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0 0 8px 0;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 768px) {
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

const AuthorName = styled.span`
  font-weight: 500;
  color: #374151;
  font-size: 1rem;
`;

const DateSetion = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 12px;
`;

export type PostListTemplateProps = {
  posts: Post[];
};

const PostListTemplate = ({ posts }: PostListTemplateProps) => {
  const router = useRouter();
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const gridComponents = {
    List: ({ children, ...props }: any) => (
      <Container {...props}>{children}</Container>
    ),
    Item: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  };

  const firstPostUser = posts.length > 0 ? posts[0].user : null;

  return (
    <Background>
      {firstPostUser && (
        <PageContainer>
          <UserProfileSection>
            <UserAvatar>
              {firstPostUser.image ? (
                <UserImage
                  src={firstPostUser.image}
                  alt={firstPostUser.name || "User"}
                />
              ) : (
                getInitials(firstPostUser.name)
              )}
            </UserAvatar>
            <UserInfo>
              <UserName>{firstPostUser.name || "Unknown User"}</UserName>
              <UserDescription>
                {firstPostUser.description || ""}
              </UserDescription>
            </UserInfo>
          </UserProfileSection>
        </PageContainer>
      )}
      {posts.length ? (
        <VirtuosoGrid
          useWindowScroll
          style={{ height: "100%", width: "100%", position: "absolute" }}
          data={posts}
          components={gridComponents}
          itemContent={(_, post) => {
            const { id, title, user, createdAt } = post;
            return (
              <Article key={id} onClick={() => router.push(`/post/${id}`)}>
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
                      <AuthorName>{user.name || "Unknown Author"}</AuthorName>
                    </AuthorInfo>
                  </AuthorSection>
                  <DateSetion>
                    公開日: {dayjs(createdAt).format("YYYY年MM月DD日")}
                  </DateSetion>
                </Header>
              </Article>
            );
          }}
        />
      ) : (
        <Container>
          <EmptyMessage>投稿がありません。</EmptyMessage>
        </Container>
      )}
    </Background>
  );
};

export default PostListTemplate;
