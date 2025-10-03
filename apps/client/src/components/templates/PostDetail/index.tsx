"use client";

import { FC } from "react";
import { User, Post } from "@/lib/api";
import { Richmd } from "@richmd/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
// @ts-ignore-next-line
import "@richmd/react/dist/richmd.css";

const Background = styled.div`
  background: #dae2e6;
  min-height: calc(100vh - 55px);
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  min-height: calc(80vh - 48px);
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Article = styled.article`
  height: 100%;
  background-color: #fff;
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

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DateSection = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 8px;
`;

const AuthorProfile = styled.aside`
  background-color: #fff;
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

  @media (max-width: 768px) {
    padding: 24px;
    position: static;
  }
`;

const AuthorAvatar = styled.div`
  width: 100%;
  max-width: 70px;
  min-width: 60px;
  height: 100%;
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

const AuthorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AuthorName = styled.h2`
  font-weight: 600;
  color: #111827;
  font-size: 1.25rem;
  margin: 0;
`;

const AuthorBio = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;


const AuthorProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
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
  post: Pick<Post, "id" | "title" | "content"> & {
    createdAt: string;
    user: Omit<User, "emailVerified">;
  };
  authUserEmail: string | null | undefined;
};

const PostDetailTemplate: FC<PostDetailTemplateProps> = ({
  post: { id, title, content, user, createdAt },
  authUserEmail,
}) => {
  const router = useRouter();
  const { deletePost } = usePosts();
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      await deletePost(id);
      alert("削除しました");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    }
  };

  return (
    <Background>
      <Container>
        <TwoColumnLayout>
          <Article>
            <Header>
              <HeaderContent>
                <Title>{title}</Title>
                <DateSection>
                  公開日: {dayjs(createdAt).format("YYYY年MM月DD日")}
                </DateSection>
              </HeaderContent>
              {authUserEmail === user.email && (
                <DeleteButton onClick={() => handleDelete(id)}>削除</DeleteButton>
              )}
            </Header>
            <Content>
              <Richmd text={content} />
            </Content>
          </Article>
          <AuthorProfile>
            <AuthorAvatar>
              {user.image ? (
                <AuthorImage src={user.image} alt={user.name || "Author"} />
              ) : (
                getInitials(user.name)
              )}
            </AuthorAvatar>
            <AuthorProfileDetail>
              <AuthorName>{user.name || "Unknown Author"}</AuthorName>
              <AuthorBio>
                {user.description || ""}
              </AuthorBio>
            </AuthorProfileDetail>
          </AuthorProfile>
        </TwoColumnLayout>
      </Container>
    </Background>
  );
};

export default PostDetailTemplate;
