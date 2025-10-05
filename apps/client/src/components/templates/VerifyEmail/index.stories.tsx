import VerifyEmailTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Templates/VerifyEmail",
  component: VerifyEmailTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof VerifyEmailTemplate>;

export const Default: StoryObj<typeof VerifyEmailTemplate> = {};
