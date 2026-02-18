import type { Meta, StoryObj } from "@storybook/react";
import LoadingSpinner from "../../components/elements/LoadingSpinner";

export default {
  title: "Shared/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof LoadingSpinner>;

export const Default: StoryObj<typeof LoadingSpinner> = {};

export const CustomSize: StoryObj<typeof LoadingSpinner> = {
  args: {
    size: 120,
  },
};

export const CustomColor: StoryObj<typeof LoadingSpinner> = {
  args: {
    color: "#3b82f6",
  },
};

export const Small: StoryObj<typeof LoadingSpinner> = {
  args: {
    size: 40,
    color: "#10b981",
  },
};
