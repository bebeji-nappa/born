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
  width: 300px;
  background-color: #0366d6;
  color: white;
  font-weight: 600;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
`;

const EditorWrapper = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
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
    ${(props) => (props.isActive ? "#0366d6" : "transparent")};
  color: ${(props) => (props.isActive ? "#0366d6" : "#586069")};
  font-weight: ${(props) => (props.isActive ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #0366d6;
    background-color: #f6f8fa;
  }
`;

export type PostEditInputValues = {
  title: string;
  content: string;
};

export type PostEditTemplateProps = {
  id: number;
  title: string;
  content: string;
};

const PostEditTemplate: FC<PostEditTemplateProps> = ({
  id,
  title,
  content,
}) => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState("");
  const [isEdit, { toggle: handleIsEdit }] = useBoolean(true);
  const { updatePost } = usePosts();

  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      title: title,
      content: content,
    },
  });

  const onSubmit = async (e: any) => {
    try {
      await updatePost(id, e.title, e.content);
      router.push(`/post/${id}`);
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
            <Preview text={getValues("content")} />
          )}
        </EditorWrapper>
        <SubmitButton type="submit">送信</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default PostEditTemplate;
