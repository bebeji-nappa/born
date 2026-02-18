import type { Meta, StoryObj } from "@storybook/react";
import PostListManagement from "../../components/views/PostListManagement";

export default {
  title: "Features/PostListManagement",
  component: PostListManagement,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof PostListManagement>;

export const Default: StoryObj<typeof PostListManagement> = {
  args: {
    posts: [
      {
        id: 1,
        title: "サンプル記事",
        content: "これはサンプルの記事内容です。",
        published: true,
        userId: "user-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: "user-1",
          email: "test@example.com",
          name: "テストユーザー",
          screen_name: "testuser",
          createdAt: new Date().toISOString(),
        },
      },
    ],
    onDelete: async () => {},
  },
};
