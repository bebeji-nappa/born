import type { Meta, StoryObj } from "@storybook/react";
import BorderedButton from "./index";

export default {
  title: "BorderdButton",
  component: BorderedButton,
  args: {
    children: "Button",
  },
} as Meta<typeof BorderedButton>;

export const Primary: StoryObj<typeof BorderedButton> = {};
