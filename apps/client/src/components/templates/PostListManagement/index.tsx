"use client";
import { useToast } from "@/hooks/useToast";

import { FC } from "react";
import { Post } from "@/lib/api";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Virtuoso } from "react-virtuoso";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
  min-height: calc(100vh - 60px);

  @media (max-width: 860px) {
    padding: 16px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 860px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PostInfo = styled.div`
  flex: 1;
`;

const PostTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #3b82f6;
    }
  }
`;

const DraftBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #92400e;
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 16px;
`;

const PostMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

const PostContent = styled.p`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 860px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const EditButton = styled.button`
  background-color: #f5f5f5;
  color: #000000;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const DeleteButton = styled.button`
  background-color: #f5f5f5;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const CreateButton = styled.button`
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 24px;

  &:hover {
    background-color: #333333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
`;

const EmptyMessage = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 16px;
`;

interface PostListManagementProps {
  posts: Post[];
  onDelete: (id: number) => Promise<void>;
}

const PostListManagement: FC<PostListManagementProps> = ({
  posts,
  onDelete,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) return;

    try {
      await onDelete(id);
      showToast("削除しました", "success");
    } catch (error) {
      console.error(error);
      showToast("削除に失敗しました", "error");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/post/${id}/edit`);
  };

  const handleCreate = () => {
    router.push("/post/create");
  };

  return (
    <Container>
      <Title>投稿管理</Title>
      <CreateButton onClick={handleCreate}>新規投稿</CreateButton>
      {posts.length === 0 ? (
        <EmptyState>
          <EmptyMessage>まだ投稿がありません</EmptyMessage>
          <CreateButton onClick={handleCreate}>最初の投稿を作成</CreateButton>
        </EmptyState>
      ) : (
        <Virtuoso
          useWindowScroll
          style={{ height: "100%", width: "100%", position: "absolute" }}
          data={posts}
          components={{ Footer: () => <div style={{ height: 80 }} /> }}
          itemContent={(_, post) => (
            <PostCard key={post.id}>
              <PostInfo>
                <PostTitle>
                  <Link href={`/post/${post.id}`}>{post.title}</Link>
                  {!post.published && <DraftBadge>下書き</DraftBadge>}
                </PostTitle>
                <PostMeta>
                  作成日: {dayjs(post.createdAt).format("YYYY年MM月DD日 HH:mm")}
                </PostMeta>
                <PostContent>
                  {post.content.replace(/[#*`\[\]]/g, "").slice(0, 100)}
                  {post.content.length > 100 ? "..." : ""}
                </PostContent>
              </PostInfo>

              <Actions>
                <EditButton onClick={() => handleEdit(post.id)}>
                  編集
                </EditButton>
                <DeleteButton onClick={() => handleDelete(post.id, post.title)}>
                  削除
                </DeleteButton>
              </Actions>
            </PostCard>
          )}
        />
      )}
    </Container>
  );
};

export default PostListManagement;
