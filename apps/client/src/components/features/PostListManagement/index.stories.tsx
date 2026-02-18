import type { Meta, StoryObj } from "@storybook/react";
import PostListManagementTemplate from "./index";

export default {
  title: "Templates/PostListManagement",
  component: PostListManagementTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof PostListManagementTemplate>;

export const Default: StoryObj<typeof PostListManagementTemplate> = {};
