import type { Meta, StoryObj } from "@storybook/react";
import PostEdit from "../../components/views/PostEdit";

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

export const Default: StoryObj<typeof PostEdit> = {
  args: {
    id: 1,
    title: "サンプル記事タイトル",
    content: "# サンプル記事\n\nこれはサンプルの記事内容です。",
    published: false,
    theme: {
      backgroundColor: "#dae2e6",
      textColor: "#374151",
      linkColor: "#3b82f6",
    },
  },
};
