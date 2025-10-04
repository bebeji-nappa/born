import React, { useState, FC } from "react";
import styled from "@emotion/styled";
import { apiClient } from "@/lib/api";

const Section = styled.section`
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #f97316;
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  background-color: #f97316;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: #ea580c;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: #dc2626;
  margin-top: 4px;
`;

const SuccessMessage = styled.p`
  font-size: 14px;
  color: #16a34a;
  margin-top: 4px;
`;

const PasswordForm: FC = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // バリデーション
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.updatePassword({
        password,
        passwordConfirmation,
      });
      setSuccess("パスワードを更新しました");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err: any) {
      console.error("Password update error:", err);
      setError(
        err.response?.data?.error || "パスワードの更新に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <SectionTitle>パスワード設定</SectionTitle>
      <Description>
        ログインに使用するパスワードを設定・変更できます。
      </Description>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="password">新しいパスワード</Label>
          <Input
            id="password"
            type="password"
            placeholder="8文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="passwordConfirmation">
            パスワード（確認用）
          </Label>
          <Input
            id="passwordConfirmation"
            type="password"
            placeholder="もう一度入力してください"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={8}
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "パスワードを更新"}
        </Button>
      </Form>
    </Section>
  );
};

export default PasswordForm;
