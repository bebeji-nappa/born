import styled from "@emotion/styled";
import type React from "react";
import { type FC, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { forgotPassword } from "@/features/forgot-password/api/forgot-password";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/utils/api";
import { useAuth } from "@/utils/contexts/AuthContext";

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

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #000000;
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 48px;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: #333333;
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

const PasswordForm: FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError("現在のパスワードを入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      // 現在のパスワードで認証してからパスワードリセットメールを送信
      // まず現在のパスワードが正しいか確認（サインイン試行）
      await apiClient.signIn({
        email: user?.email || "",
        password: currentPassword,
      });

      // 認証成功したら、パスワードリセットメールを送信（アカウント設定からのリダイレクト指定）
      await forgotPassword({
        email: user?.email || "",
        redirect: "account",
      });

      showToast(
        "パスワード変更用のメールを送信しました。メールをご確認ください。",
        "success",
      );
      setShowForm(false);
      setCurrentPassword("");
      setShowCurrentPassword(false);
      setError(null);
    } catch (err: any) {
      console.error("Password change request error:", err);
      setError(
        err.message === "Invalid email or password"
          ? "現在のパスワードが正しくありません"
          : "パスワード変更メールの送信に失敗しました",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <SectionTitle>パスワード変更</SectionTitle>
      <Description>ログインに使用するパスワードを変更できます。</Description>

      {!showForm ? (
        <Button type="button" onClick={() => setShowForm(true)}>
          パスワードを変更
        </Button>
      ) : (
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="currentPassword">現在のパスワード</Label>
            <InputWrapper>
              <PasswordInput
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="現在のパスワードを入力"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <EyeButton
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={
                  showCurrentPassword ? "パスワードを隠す" : "パスワードを表示"
                }
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </EyeButton>
            </InputWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "パスワードを変更する"}
          </Button>
        </Form>
      )}
    </Section>
  );
};

export default PasswordForm;
