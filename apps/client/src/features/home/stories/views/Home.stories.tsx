import type { Meta, StoryObj } from "@storybook/react";
import Home from "../../components/views/Home";

export default {
  title: "Features/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof Home>;

export const Default: StoryObj<typeof Home> = {};
