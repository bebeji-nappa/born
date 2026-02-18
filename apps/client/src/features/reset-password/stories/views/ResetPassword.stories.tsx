import type { Meta, StoryObj } from "@storybook/react";
import ResetPassword from "../../components/views/ResetPassword";

export default {
  title: "Features/ResetPassword",
  component: ResetPassword,
} as Meta<typeof ResetPassword>;

export const Primary: StoryObj<typeof ResetPassword> = {
  args: {
    token: "sample-token",
  },
};
