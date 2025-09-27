import { FC } from 'react';
import { User, Post } from '../../../../prisma/generated/prisma';
import { Richmd } from '@richmd/react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
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
  margin: 0 auto;
  padding: 24px;
  min-height: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Article = styled.article`
  background-color: #fff;
  border-radius: 12px;
  min-height: calc(80vh - 48px);
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
`;

const Header = styled.header`
  padding: 32px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const HeaderContent = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0 0 20px 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
`;

const AuthorAvatar = styled.div`
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
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

const AuthorLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const DateSetion = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 12px;
`;

const Content = styled.div`
  padding: 32px;
  min-height: 100%;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }

  .richmd {
    line-height: 1.7;
    color: #374151;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #111827;
      margin-top: 2em;
      margin-bottom: 1em;
      font-weight: 600;
    }

    p {
      margin-bottom: 1.25em;
    }

    code {
      background-color: #f3f4f6;
      padding: 0.25em 0.5em;
      border-radius: 4px;
      font-size: 0.875em;
    }

    pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 1.5em;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5em 0;
    }

    blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1.5em;
      margin: 1.5em 0;
      font-style: italic;
      color: #6b7280;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5em 0;
    }

    a {
      color: #3b82f6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const RedirectButton = styled.button`
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 16px;
  padding: 0;
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: auto;
  height: fit-content;

  &:hover {
    background-color: #dc2626;
  }
`;

export type PostDetailTemplateProps = {
  post: Pick<Post, 'id' | 'title' | 'content'> & {
    createdAt: string;
    user: Omit<User, 'emailVerified'>;
  };
  authUserEmail: string | null | undefined;
};

const PostDetailTemplate: FC<PostDetailTemplateProps> = ({
  post: { id, title, content, user, createdAt },
  authUserEmail,
}) => {
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
  const deletePostMutation = trpc.deletePostById.useMutation();

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      await deletePostMutation.mutateAsync({ id });
      alert('削除しました');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    }
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
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              sizes="100vw"
              fill
              style={{
                width: '100%',
              }}
            />
          </Link>
        </div>
      </PageHeader>
      <Container>
        <RedirectButton onClick={() => router.push('/')}>
          {'< 一覧に戻る'}
        </RedirectButton>
        <Article>
          <Header>
            <HeaderContent>
              <Title>{title}</Title>
              <AuthorSection>
                <AuthorAvatar>
                  {user.image ? (
                    <AuthorImage src={user.image} alt={user.name || 'Author'} />
                  ) : (
                    getInitials(user.name)
                  )}
                </AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{user.name || 'Unknown Author'}</AuthorName>
                  {/* <AuthorLabel></AuthorLabel> */}
                </AuthorInfo>
              </AuthorSection>
              <DateSetion>
                公開日: {dayjs(createdAt).format('YYYY年MM月DD日')}
              </DateSetion>
            </HeaderContent>
            {authUserEmail === user.email && (
              <DeleteButton onClick={() => handleDelete(id)}>削除</DeleteButton>
            )}
          </Header>
          <Content>
            <Richmd text={content} />
          </Content>
        </Article>
      </Container>
    </Background>
  );
};

export default PostDetailTemplate;
