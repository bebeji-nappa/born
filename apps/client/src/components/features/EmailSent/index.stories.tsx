import type { Meta, StoryObj } from "@storybook/react";
import EmailSentTemplate from "./index";

export default {
  title: "Templates/EmailSent",
  component: EmailSentTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof EmailSentTemplate>;

export const Default: StoryObj<typeof EmailSentTemplate> = {};
