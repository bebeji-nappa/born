import styled from "@emotion/styled";
import { useBoolean } from "ahooks";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import MarkdownEditor from "@/components/elements/MarkdownEditor";
import { createPost } from "../../api/create";
import Preview from "../templates/Preview";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const CustomHeader = styled.header`
  background: #ffffff;
  padding: 12px 24px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #374151;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100px;
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
    content: "";
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

export type PostCreateProps = {
  userId: string;
  theme: ThemeConfig;
};

const PostCreate: FC<PostCreateProps> = ({ userId, theme }) => {
  const router = useRouter();
  const [isEdit, { toggle: handleIsEdit }] = useBoolean(true);
  const [isPublished, setIsPublished] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, getValues, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const contentValue = watch("content");

  const onSubmit = async (e: any) => {
    try {
      setIsLoading(true);
      const { newPost } = await createPost(e.title, e.content, isPublished);
      if (newPost.published) {
        router.push(`/post/${newPost.id}`);
      } else {
        router.push("/post/dashboard");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      setAlertMessage("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageWrapper>
      <CustomHeader>
        <HeaderLeft>
          <BackButton type="button" onClick={handleBack} aria-label="戻る">
            <FiArrowLeft />
          </BackButton>
        </HeaderLeft>
        <HeaderRight>
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
          <SubmitButton
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "保存中..." : isPublished ? "公開する" : "下書き保存"}
          </SubmitButton>
        </HeaderRight>
      </CustomHeader>
      <Wrapper>
        {alertMessage && <p style={{ color: "red" }}>{alertMessage}</p>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="title">タイトル</Label>
          <Input
            type="text"
            {...register("title")}
            placeholder="タイトルを入力..."
          />
          <Label htmlFor="content">内容</Label>
          <MarkdownEditor
            value={contentValue || ""}
            onChange={(value) => {
              setValue("content", value, {
                shouldValidate: false,
                shouldDirty: true,
              });
            }}
            isEdit={isEdit}
            onToggleEdit={handleIsEdit}
            previewComponent={
              <Preview
                text={contentValue || ""}
                id="content"
                textColor={theme.textColor}
                linkColor={theme.linkColor}
              />
            }
            textareaProps={{ placeholder: "記事の内容を入力..." }}
          />
        </Form>
      </Wrapper>
    </PageWrapper>
  );
};

export default PostCreate;
