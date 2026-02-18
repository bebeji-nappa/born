import type { Meta, StoryObj } from "@storybook/react";
import SignUp from "../../components/views/SignUp";

export default {
  title: "Features/SignUp",
  component: SignUp,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof SignUp>;

export const Default: StoryObj<typeof SignUp> = {};
