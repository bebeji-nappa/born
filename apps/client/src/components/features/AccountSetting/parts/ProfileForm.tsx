import styled from "@emotion/styled";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { apiClient, type User } from "@/lib/api";

const Section = styled.div`
  background: white;
  padding: 24px 36px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 100%;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #000000;
  }
`;

const Textarea = styled.textarea`
  padding: 8px 12px;
  resize: vertical;
  min-height: 100px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 100%;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #000000;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
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

const UserProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;

  @media (max-width: 860px) {
    width: 100%;
  }
`;

interface FormData {
  name: string;
  description: string;
}

export type ProfileFormProps = {
  user: User;
};

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const { showToast } = useToast();
  const { refetch } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: user.name || "",
      description: user.description || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.updateUserProfile({
        name: data.name,
        description: data.description || null,
      });
      await refetch();
      showToast("プロフィールを更新しました", "success");
    } catch (err) {
      console.error("Profile update error:", err);
      showToast("プロフィールの更新に失敗しました", "error");
    }
  };

  return (
    <Section>
      <UserProfileSection>
        <SectionTitle>基本情報</SectionTitle>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            type="text"
            {...register("name", { required: true })}
            disabled={isSubmitting}
          />

          <Label htmlFor="description">自己紹介</Label>
          <Textarea
            id="description"
            {...register("description")}
            disabled={isSubmitting}
            placeholder="あなたについて教えてください"
          />

          <SaveButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </SaveButton>
        </Form>
      </UserProfileSection>
    </Section>
  );
};

export default ProfileForm;
