import React, { useState, useCallback, FC } from "react";
import styled from "@emotion/styled";
import { useBoolean } from "ahooks";
import { useForm } from "react-hook-form";
import Preview from "./parts/Preview";
import { usePosts } from "@/hooks/usePosts";
import { useRouter } from "next/navigation";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 20px auto 0;
  gap: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 100%;
  outline: none;
  font-size: 20px;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  resize: none;
  height: 25rem;
  border: none;
  width: 100%;
  outline: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubmitButton = styled.button`
  width: 150px;
  background-color: #000000;
  color: white;
  font-weight: 600;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333333;
  }
`;

const EditorWrapper = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e5e9;
  margin-bottom: 16px;
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

const PublishSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`;

const SwitchInput = styled.input`
  width: 48px;
  height: 24px;
  position: relative;
  appearance: none;
  background-color: #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:checked {
    background-color: #10b981;
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
  }

  &:checked::before {
    transform: translateX(24px);
  }
`;

export type PostEditInputValues = {
  title: string;
  content: string;
};

interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
}

export type PostEditTemplateProps = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  theme: ThemeConfig;
};

const PostEditTemplate: FC<PostEditTemplateProps> = ({
  id,
  title,
  content,
  published,
  theme,
}) => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState("");
  const [isEdit, { toggle: handleIsEdit }] = useBoolean(true);
  const [isPublished, setIsPublished] = useState(published);
  const { updatePost } = usePosts();

  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      title: title,
      content: content,
    },
  });

  const onSubmit = async (e: any) => {
    try {
      await updatePost(id, e.title, e.content, isPublished);
      if (isPublished) {
        router.push(`/post/${id}`);
      } else {
        router.push("/post/list");
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      setAlertMessage("Failed to update post. Please try again.");
    }
  };

  const handleTabClick = useCallback(
    (isEditMode: boolean) => {
      if (isEdit !== isEditMode) {
        handleIsEdit();
      }
    },
    [isEdit, handleIsEdit],
  );

  return (
    <Wrapper>
      <h1>投稿編集</h1>
      {alertMessage && <p style={{ color: "red" }}>{alertMessage}</p>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">タイトル</Label>
        <Input type="text" defaultValue={title} {...register("title")} />

        <Label htmlFor="content">内容</Label>
        <EditorWrapper id="content">
          <TabContainer>
            <Tab
              type="button"
              isActive={isEdit}
              onClick={() => handleTabClick(true)}
            >
              Edit
            </Tab>
            <Tab
              type="button"
              isActive={!isEdit}
              onClick={() => handleTabClick(false)}
            >
              Preview
            </Tab>
          </TabContainer>

          {isEdit ? (
            <Textarea defaultValue={content} {...register("content")} />
          ) : (
            <Preview text={getValues("content")} textColor={theme.textColor} linkColor={theme.linkColor} />
          )}
        </EditorWrapper>
        <Footer>
          <SubmitButton type="submit">
            {isPublished ? "公開する" : "下書き保存"}
          </SubmitButton>
          <PublishSwitchWrapper>
            <SwitchLabel>
              <SwitchInput
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>{isPublished ? "公開する" : "下書き保存"}</span>
            </SwitchLabel>
          </PublishSwitchWrapper>
        </Footer>
      </Form>
    </Wrapper>
  );
};

export default PostEditTemplate;
