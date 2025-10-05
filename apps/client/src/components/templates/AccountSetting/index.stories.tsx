import AccountSettingTemplate from "./index";
import type { User } from "@/lib/api";

import type { Meta, StoryObj } from "@storybook/react";

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "テストユーザー",
  screen_name: "testuser",
  image: "https://avatars.githubusercontent.com/u/1?v=4",
  description: "テスト用のユーザーです",
  createdAt: new Date().toISOString(),
};

const mockUserWithoutAvatar: User = {
  ...mockUser,
  image: undefined,
};

export default {
  title: "Templates/AccountSetting",
  component: AccountSettingTemplate,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof AccountSettingTemplate>;

export const Default: StoryObj<typeof AccountSettingTemplate> = {
  args: {
    user: mockUser,
  },
};

export const WithoutAvatar: StoryObj<typeof AccountSettingTemplate> = {
  args: {
    user: mockUserWithoutAvatar,
  },
};
