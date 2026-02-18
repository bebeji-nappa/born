import type { Meta, StoryObj } from "@storybook/react";
import EmailSent from "../../components/views/EmailSent";

export default {
  title: "Features/EmailSent",
  component: EmailSent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof EmailSent>;

export const Default: StoryObj<typeof EmailSent> = {};
