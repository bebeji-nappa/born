import SignUpTemplate from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Templates/SignUp",
  component: SignUpTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof SignUpTemplate>;

export const Default: StoryObj<typeof SignUpTemplate> = {};
