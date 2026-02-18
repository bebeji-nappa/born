import type { Meta } from "@storybook/react";
import VerifyEmail from "../components/VerifyEmail";

export default {
  title: "Features/VerifyEmail",
  component: VerifyEmail,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof VerifyEmail>;

// TODO: API のモック作成後、有効化
// export const Default: StoryObj<typeof VerifyEmail> = {};
