import React, { useRef, useCallback, FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { FiImage, FiLink, FiCode, FiInfo, FiSmile } from "react-icons/fi";
import {
  BsTypeH1,
  BsTypeBold,
  BsTypeItalic,
  BsQuote,
  BsTypeStrikethrough,
} from "react-icons/bs";
import { useToast } from "@/hooks/useToast";
import MarkdownHelpModal from "@/components/common/MarkdownHelpModal";
import EmojiPicker from "@/components/common/EmojiPicker";

const EditorWrapper = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const TabAndToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e5e9;
  padding-right: 8px;
`;

const TabContainer = styled.div`
  display: flex;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.isActive ? "#000000" : "transparent")};
  color: ${(props) => (props.isActive ? "#000000" : "#586069")};
  font-weight: ${(props) => (props.isActive ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #000000;
    background-color: #f6f8fa;
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  position: relative;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #586069;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #000000;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Textarea = styled.textarea`
  padding: 8px;
  resize: none;
  height: 28rem;
  border: none;
  width: 100%;
  outline: none;
  font-size: 16px;
`;

const HelpLink = styled.span`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 13px;
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
  width: fit-content;

  &:hover {
    color: #111827;
  }
`;

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  isEdit: boolean;
  onToggleEdit: () => void;
  previewComponent: React.ReactNode;
  textareaProps?: any;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value,
  onChange,
  isEdit,
  onToggleEdit,
  previewComponent,
  textareaProps,
}) => {
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const insertText = useCallback(
    (before: string, after: string = "", setCursorMiddle: boolean = false) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = value;
      const newValue =
        currentValue.substring(0, start) +
        before +
        after +
        currentValue.substring(end);
      onChange(newValue);

      setTimeout(() => {
        const newCursorPos = setCursorMiddle
          ? start + Math.floor(before.length / 2)
          : start + before.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange],
  );

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const csrfToken = localStorage.getItem("csrf-token");
      const headers: HeadersInit = {};
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers,
        },
      );

      const data = await response.json();
      if (data.url) {
        insertText(`![image](${data.url})\n`);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      showToast("画像のアップロードに失敗しました", "error");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleHeading = () => insertText("# ");
  const handleBold = () => insertText("****", "", true);
  const handleItalic = () => insertText("**", "", true);
  const handleStrikethrough = () => insertText("~~~~", "", true);
  const handleQuote = () => insertText("> ");
  const handleCodeBlock = () =>
    insertText("```lang:filename\n\n```", "", false);
  const handleLink = () => insertText("[](url)");

  const handleEmojiSelect = (emojiName: string) => {
    insertText(`:${emojiName}:`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEmojiPickerOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-emoji-picker]")) {
          setIsEmojiPickerOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiPickerOpen]);

  return (
    <>
      <EditorWrapper>
        <TabAndToolbarContainer>
          <TabContainer>
            <Tab
              type="button"
              isActive={isEdit}
              onClick={() => !isEdit && onToggleEdit()}
            >
              Edit
            </Tab>
            <Tab
              type="button"
              isActive={!isEdit}
              onClick={() => isEdit && onToggleEdit()}
            >
              Preview
            </Tab>
          </TabContainer>

          {isEdit && (
            <ToolbarContainer data-emoji-picker>
              <FileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <ToolbarButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="画像をアップロード"
              >
                <FiImage />
              </ToolbarButton>
              <ToolbarButton
                type="button"
                onClick={handleHeading}
                title="見出し"
              >
                <BsTypeH1 />
              </ToolbarButton>
              <ToolbarButton type="button" onClick={handleBold} title="太字">
                <BsTypeBold />
              </ToolbarButton>
              <ToolbarButton type="button" onClick={handleItalic} title="斜体">
                <BsTypeItalic />
              </ToolbarButton>
              <ToolbarButton
                type="button"
                onClick={handleStrikethrough}
                title="打ち消し線"
              >
                <BsTypeStrikethrough />
              </ToolbarButton>
              {/* <ToolbarButton
                type="button"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                title="絵文字"
              >
                <FiSmile />
              </ToolbarButton> */}
              <ToolbarButton type="button" onClick={handleQuote} title="引用">
                <BsQuote />
              </ToolbarButton>
              <ToolbarButton
                type="button"
                onClick={handleCodeBlock}
                title="コードブロック"
              >
                <FiCode />
              </ToolbarButton>
              <ToolbarButton type="button" onClick={handleLink} title="リンク">
                <FiLink />
              </ToolbarButton>
              {isEmojiPickerOpen && (
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setIsEmojiPickerOpen(false)}
                />
              )}
            </ToolbarContainer>
          )}
        </TabAndToolbarContainer>

        {isEdit ? (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="記事の内容を入力..."
            {...textareaProps}
          />
        ) : (
          previewComponent
        )}
      </EditorWrapper>

      <HelpLink onClick={() => setIsHelpModalOpen(true)}>
        <FiInfo style={{ marginRight: 4 }} />
        Markdownの書き方
      </HelpLink>

      <MarkdownHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
};

export default MarkdownEditor;
