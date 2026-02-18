import type { Meta, StoryObj } from "@storybook/react";
import BorderedButton from "../../components/elements/BorderedButton";

export default {
  title: "Shared/BorderedButton",
  component: BorderedButton,
  args: {
    children: "Button",
  },
} as Meta<typeof BorderedButton>;

export const Primary: StoryObj<typeof BorderedButton> = {};
