import EmailSentTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Templates/EmailSent",
  component: EmailSentTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof EmailSentTemplate>;

export const Default: StoryObj<typeof EmailSentTemplate> = {};
