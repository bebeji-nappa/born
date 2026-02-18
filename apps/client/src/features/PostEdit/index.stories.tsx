import type { Meta, StoryObj } from "@storybook/react";
import PostEdit from "./index";

export default {
  title: "Features/PostEdit",
  component: PostEdit,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/post/edit/1",
      },
    },
  },
} as Meta<typeof PostEdit>;

export const Default: StoryObj<typeof PostEdit> = {};
