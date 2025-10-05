import PostListManagementTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

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
