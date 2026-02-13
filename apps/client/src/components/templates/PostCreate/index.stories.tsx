import type { Meta, StoryObj } from "@storybook/react";
import PostCreateTemplate from "./index";

export default {
  title: "Templates/PostCreate",
  component: PostCreateTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/post/create",
      },
    },
  },
} as Meta<typeof PostCreateTemplate>;

export const Default: StoryObj<typeof PostCreateTemplate> = {};
