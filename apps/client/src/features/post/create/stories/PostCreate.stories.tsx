import type { Meta, StoryObj } from "@storybook/react";
import PostCreate from "../components/PostCreate";

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

export const Default: StoryObj<typeof PostCreate> = {};
