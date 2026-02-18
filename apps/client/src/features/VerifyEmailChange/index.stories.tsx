import type { Meta, StoryObj } from "@storybook/react";
import VerifyEmailChange from "./index";

const meta = {
  title: "Features/VerifyEmailChange",
  component: VerifyEmailChange,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VerifyEmailChange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    success: true,
    message: "メールアドレスが正常に変更されました",
  },
};

export const Error: Story = {
  args: {
    success: false,
    message: "Invalid or expired token",
  },
};

export const ExpiredToken: Story = {
  args: {
    success: false,
    message: "Token has expired",
  },
};
