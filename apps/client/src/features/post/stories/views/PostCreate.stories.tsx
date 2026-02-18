import type { Meta, StoryObj } from "@storybook/react";
import PostCreate from "../../components/views/PostCreate";

export default {
  title: "Features/PostCreate",
  component: PostCreate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/post/create",
      },
    },
  },
} as Meta<typeof PostCreate>;

export const Default: StoryObj<typeof PostCreate> = {
  args: {
    userId: "user-1",
    theme: {
      backgroundColor: "#dae2e6",
      textColor: "#374151",
      linkColor: "#3b82f6",
    },
  },
};
