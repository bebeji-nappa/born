import type { Meta, StoryObj } from "@storybook/react";
import type { User } from "@/lib/api";
import ProfileSetup from "../components/ProfileSetup";

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: null,
  screen_name: null,
  image: undefined,
  description: null,
  createdAt: new Date().toISOString(),
};

export default {
  title: "Features/ProfileSetup",
  component: ProfileSetup,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof ProfileSetup>;

export const Default: StoryObj<typeof ProfileSetup> = {
  args: {
    user: mockUser,
  },
};
