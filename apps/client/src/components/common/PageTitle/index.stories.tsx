import { PageTitle } from "./index";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Common/PageTitle",
  component: PageTitle,
  parameters: {
    docs: {
      description: {
        component:
          "ページタイトルを設定するコンポーネント。document.titleを動的に変更します。",
      },
    },
  },
} as Meta<typeof PageTitle>;

export const Default: StoryObj<typeof PageTitle> = {
  args: {
    title: "ホーム",
  },
};

export const AccountSetting: StoryObj<typeof PageTitle> = {
  args: {
    title: "アカウント設定",
  },
};

export const PostCreate: StoryObj<typeof PageTitle> = {
  args: {
    title: "記事を作成",
  },
};
