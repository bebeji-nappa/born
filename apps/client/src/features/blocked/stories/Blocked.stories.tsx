import type { Meta, StoryObj } from "@storybook/react";
import Blocked from "../components/Blocked";

export default {
  title: "Features/Blocked",
  component: Blocked,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Blocked>;

export const Default: StoryObj<typeof Blocked> = {};
