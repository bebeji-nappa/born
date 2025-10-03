import React, { FC } from "react";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { User, apiClient } from "@/lib/api";

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
    border-color: #0366d6;
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
    border-color: #0366d6;
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
  background-color: #0366d6;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0256c7;
  }

  &:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }
`;

const UserProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ErrorMessage = styled.p`
  color: #d73a49;
  font-size: 14px;
  margin-top: 8px;
`;

interface FormData {
  name: string;
  description: string;
}

export type ProfileFormProps = {
  user: User;
};

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: user.name,
      description: user.description || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.updateUserProfile({
        name: data.name,
        description: data.description || null,
      });
    } catch (err) {
      console.error("Profile update error:", err);
      setError("root", { message: "プロフィールの更新に失敗しました" });
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

          {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

          <SaveButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </SaveButton>
        </Form>
      </UserProfileSection>
    </Section>
  );
};

export default ProfileForm;
