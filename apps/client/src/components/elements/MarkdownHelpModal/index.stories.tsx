import type { Meta, StoryObj } from "@storybook/react";
import MarkdownHelpModal from "./index";

const meta = {
  title: "Common/MarkdownHelpModal",
  component: MarkdownHelpModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarkdownHelpModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
  },
};
