import type { Meta, StoryObj } from "@storybook/react";
import type { User } from "@/lib/api";
import ProfileSetupTemplate from "./index";

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
  title: "Templates/ProfileSetup",
  component: ProfileSetupTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof ProfileSetupTemplate>;

export const Default: StoryObj<typeof ProfileSetupTemplate> = {
  args: {
    user: mockUser,
  },
};
