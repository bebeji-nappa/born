import BlockedTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Templates/Blocked",
  component: BlockedTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof BlockedTemplate>;

export const Default: StoryObj<typeof BlockedTemplate> = {};
