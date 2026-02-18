import type { Meta, StoryObj } from "@storybook/react";
import BlogSetting from "../../components/views/BlogSetting";

export default {
  title: "Features/BlogSetting",
  component: BlogSetting,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof BlogSetting>;

export const Default: StoryObj<typeof BlogSetting> = {
  args: {
    blogId: 1,
    user: {
      id: "user-1",
      email: "test@example.com",
      name: "テストユーザー",
      screen_name: "testuser",
      createdAt: new Date().toISOString(),
    },
  },
};
