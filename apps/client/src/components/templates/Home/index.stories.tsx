import type { Meta, StoryObj } from "@storybook/react";
import HomeTemplate from "./index";

export default {
  title: "Templates/Home",
  component: HomeTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof HomeTemplate>;

export const Default: StoryObj<typeof HomeTemplate> = {};
