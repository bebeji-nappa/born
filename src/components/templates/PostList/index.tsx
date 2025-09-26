import { Richmd } from '@richmd/react';
import { Post, User } from '../../../../prisma/generated/prisma';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso';
// @ts-ignore-next-line
import '@richmd/react/dist/richmd.css';

const Background = styled.div`
  background: #ffd600;
  min-height: 100vh;
  position: relative;
`;

const PageHeader = styled.header`
  background: #000;
  padding: 16px 24px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  width: 100vw;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 24px;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
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
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0 0 14px 0;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 2rem;
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
  posts: Post &
    {
      user: User;
    }[];
};

const PostListTemplate = ({ posts }) => {
  const router = useRouter();
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const gridComponents = {
    List: ({ children, ...props }: any) => (
      <Container {...props}>{children}</Container>
    ),
    Item: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  };

  return (
    <Background>
      <PageHeader>
        <div
          style={{
            display: 'block',
            position: 'relative',
            width: '200px',
            height: '50px',
          }}
        >
          <Image
            src="/logo.svg"
            alt="logo"
            sizes="100vw"
            fill
            style={{
              width: '100%',
            }}
          />
        </div>
      </PageHeader>
      {posts.length ? (
        <VirtuosoGrid
          style={{ height: 'calc(100vh - 82px)' }}
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
                          alt={user.name || 'Author'}
                        />
                      ) : (
                        getInitials(user.name)
                      )}
                    </AuthorAvatar>
                    <AuthorInfo>
                      <AuthorName>{user.name || 'Unknown Author'}</AuthorName>
                    </AuthorInfo>
                  </AuthorSection>
                  <DateSetion>
                    公開日: {dayjs(createdAt).format('YYYY年MM月DD日')}
                  </DateSetion>
                </Header>
              </Article>
            );
          }}
        />
      ) : (
        <Container>投稿がありません。</Container>
      )}
    </Background>
  );
};

export default PostListTemplate;
