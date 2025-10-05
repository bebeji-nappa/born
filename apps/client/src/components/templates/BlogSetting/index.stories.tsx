import BlogSettingTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Templates/BlogSetting",
  component: BlogSettingTemplate,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof BlogSettingTemplate>;

export const Default: StoryObj<typeof BlogSettingTemplate> = {};
