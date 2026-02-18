import styled from "@emotion/styled";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { apiClient, type User } from "@/lib/api";

const Section = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  width: 100%;
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #000000;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const SaveButton = styled.button`
  align-self: center;
  width: 120px;
  background-color: #000000;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #333333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

interface FormData {
  screen_name: string;
}

export type ScreenNameFormProps = {
  user: User;
};

const ScreenNameForm: FC<ScreenNameFormProps> = ({ user }) => {
  const { showToast } = useToast();
  const { refetch } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      screen_name: user.screen_name || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.updateUserScreenName(data.screen_name);
      await refetch();
      showToast("ユーザIDを更新しました", "success");
    } catch (err) {
      console.error("Screen name update error:", err);
      showToast("ユーザIDの更新に失敗しました", "error");
    }
  };

  return (
    <Section>
      <SectionTitle>ユーザIDを更新</SectionTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="screen_name"
          type="text"
          {...register("screen_name")}
          disabled={isSubmitting}
          placeholder="ユーザIDを入力してください"
        />
        <SaveButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </SaveButton>
      </Form>
    </Section>
  );
};

export default ScreenNameForm;
