import type { Meta, StoryObj } from "@storybook/react";
import BlogSetting from "./index";

export default {
  title: "Features/BlogSetting",
  component: BlogSetting,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof BlogSetting>;

export const Default: StoryObj<typeof BlogSetting> = {};
