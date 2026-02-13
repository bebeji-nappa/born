import type { Meta, StoryObj } from "@storybook/react";
import BlockedTemplate from "./index";

export default {
  title: "Templates/Blocked",
  component: BlockedTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof BlockedTemplate>;

export const Default: StoryObj<typeof BlockedTemplate> = {};
