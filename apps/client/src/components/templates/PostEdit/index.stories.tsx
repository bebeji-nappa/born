import PostEditTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Templates/PostEdit",
  component: PostEditTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/post/edit/1",
      },
    },
  },
} as Meta<typeof PostEditTemplate>;

export const Default: StoryObj<typeof PostEditTemplate> = {};
