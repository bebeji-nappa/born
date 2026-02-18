import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "../../components/layouts/PageHeader";

const meta = {
  title: "Common/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/session",
        method: "GET",
        status: 200,
        response: {
          user: null,
        },
      },
    ],
  },
};

export const LoggedIn: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/session",
        method: "GET",
        status: 200,
        response: {
          user: {
            id: "1",
            name: "テストユーザー",
            email: "test@example.com",
            screen_name: "testuser",
            image: null,
          },
        },
      },
    ],
  },
};

export const LoggedInWithAvatar: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/session",
        method: "GET",
        status: 200,
        response: {
          user: {
            id: "1",
            name: "テストユーザー",
            email: "test@example.com",
            screen_name: "testuser",
            image: "https://avatars.githubusercontent.com/u/1?v=4",
          },
        },
      },
    ],
  },
};
