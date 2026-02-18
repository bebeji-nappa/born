import type { Meta, StoryObj } from "@storybook/react";
import PostListManagement from "./index";

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

export const Default: StoryObj<typeof PostListManagement> = {};
