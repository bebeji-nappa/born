import type { Meta, StoryObj } from "@storybook/react";
import PostEditTemplate from "./index";

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
