import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import MarkdownEditor from "./index";

const PreviewComponent = ({ content }: { content: string }) => (
  <div style={{ padding: "16px" }}>
    <div
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
    />
  </div>
);

const meta = {
  title: "Common/MarkdownEditor",
  component: MarkdownEditor,
  parameters: {
    layout: "padded",
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [isEdit, setIsEdit] = useState(args.isEdit);

    return (
      <MarkdownEditor
        {...args}
        value={value}
        onChange={setValue}
        isEdit={isEdit}
        onToggleEdit={() => setIsEdit(!isEdit)}
        previewComponent={<PreviewComponent content={value} />}
      />
    );
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "# マークダウンエディタ\n\nここに文章を入力してください。",
    onChange: () => {},
    isEdit: true,
    onToggleEdit: () => {},
    previewComponent: <div />,
  },
};

export const WithInitialContent: Story = {
  args: {
    value:
      "# タイトル\n\n## サブタイトル\n\n**太字**と*斜体*のテキスト。\n\n- リスト1\n- リスト2\n- リスト3",
    onChange: () => {},
    isEdit: true,
    onToggleEdit: () => {},
    previewComponent: <div />,
  },
};

export const PreviewMode: Story = {
  args: {
    value: "# プレビューモード\n\nこれはプレビュー表示です。",
    onChange: () => {},
    isEdit: false,
    onToggleEdit: () => {},
    previewComponent: <div />,
  },
};
