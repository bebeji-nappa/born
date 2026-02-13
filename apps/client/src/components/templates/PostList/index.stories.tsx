import type { Meta, StoryObj } from "@storybook/react";
import PostListTemplate from "./index";

export default {
  title: "Templates/PostList",
  component: PostListTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof PostListTemplate>;

export const Default: StoryObj<typeof PostListTemplate> = {};
