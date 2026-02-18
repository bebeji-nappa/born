import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "../../components/elements/Toast";

const meta = {
  title: "Shared/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: "保存しました",
    type: "success",
    onClose: () => console.log("Toast closed"),
    duration: 10000,
  },
};

export const Error: Story = {
  args: {
    message: "削除に失敗しました",
    type: "error",
    onClose: () => console.log("Toast closed"),
    duration: 10000,
  },
};

export const LongMessage: Story = {
  args: {
    message:
      "画像のアップロードに失敗しました。ファイルサイズは2MB以下にしてください。",
    type: "error",
    onClose: () => console.log("Toast closed"),
    duration: 10000,
  },
};
