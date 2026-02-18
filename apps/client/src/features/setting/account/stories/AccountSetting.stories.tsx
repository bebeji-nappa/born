import type { Meta, StoryObj } from "@storybook/react";
import type { User } from "@/utils/api";
import AccountSetting from "../components/AccountSetting";

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
  title: "Features/AccountSetting",
  component: AccountSetting,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof AccountSetting>;

export const Default: StoryObj<typeof AccountSetting> = {
  args: {
    user: mockUser,
  },
};

export const WithoutAvatar: StoryObj<typeof AccountSetting> = {
  args: {
    user: mockUserWithoutAvatar,
  },
};
