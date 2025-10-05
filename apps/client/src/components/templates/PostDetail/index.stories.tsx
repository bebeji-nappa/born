import PostDetailTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

const mockPost = {
  id: 1,
  title: "サンプル記事のタイトル",
  content: "# はじめに\n\nこれはサンプル記事です。\n\n## 内容\n\nマークダウン形式で記述されています。",
  createdAt: new Date().toISOString(),
  user: {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    screen_name: "testuser",
    image: "https://avatars.githubusercontent.com/u/1?v=4",
    description: "テスト用のユーザーです",
    createdAt: new Date().toISOString(),
  },
};

const mockBlog = {
  id: 1,
  title: "テストブログ",
  description: "テスト用のブログです",
  theme: "default",
  backgroundImage: null,
  backgroundImageKey: null,
  userId: "1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default {
  title: "Templates/PostDetail",
  component: PostDetailTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof PostDetailTemplate>;

export const Default: StoryObj<typeof PostDetailTemplate> = {
  args: {
    post: mockPost,
    blog: mockBlog,
    authUserEmail: null,
  },
};

export const AuthenticatedUser: StoryObj<typeof PostDetailTemplate> = {
  args: {
    post: mockPost,
    blog: mockBlog,
    authUserEmail: "test@example.com",
  },
};

export const WithoutBlog: StoryObj<typeof PostDetailTemplate> = {
  args: {
    post: mockPost,
    blog: null,
    authUserEmail: null,
  },
};
