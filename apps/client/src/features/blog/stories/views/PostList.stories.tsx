import type { Meta, StoryObj } from "@storybook/react";
import PostList from "../../components/views/PostList";

export default {
  title: "Features/PostList",
  component: PostList,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof PostList>;

export const Default: StoryObj<typeof PostList> = {};
