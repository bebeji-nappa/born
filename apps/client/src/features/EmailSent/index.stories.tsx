import type { Meta, StoryObj } from "@storybook/react";
import EmailSent from "./index";

export default {
  title: "Features/EmailSent",
  component: EmailSent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof EmailSent>;

export const Default: StoryObj<typeof EmailSent> = {};
