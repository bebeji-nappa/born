import React, { useState, FC } from "react";
import styled from "@emotion/styled";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { apiClient } from "@/lib/api";
import { validatePassword } from "@/lib/validation";

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

const SuccessMessage = styled.p`
  font-size: 14px;
  color: #16a34a;
  margin-top: 4px;
`;

const PasswordRequirements = styled.div`
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
`;

const RequirementItem = styled.div<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.met ? '#16a34a' : '#dc2626'};
  white-space: nowrap;

  &::before {
    content: '${props => props.met ? '✓' : '✗'}';
    font-weight: bold;
  }
`;

const PasswordForm: FC = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // パスワード要件のチェック
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // パスワード強度チェック
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || "パスワードが要件を満たしていません");
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
          <InputWrapper>
            <PasswordInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeButton>
          </InputWrapper>
          {password && (
            <PasswordRequirements>
              <RequirementItem met={passwordRequirements.minLength}>
                8文字以上
              </RequirementItem>
              <RequirementItem met={passwordRequirements.hasUpperCase}>
                英大文字を含む
              </RequirementItem>
              <RequirementItem met={passwordRequirements.hasLowerCase}>
                英小文字を含む
              </RequirementItem>
              <RequirementItem met={passwordRequirements.hasNumber}>
                数字を含む
              </RequirementItem>
              <RequirementItem met={passwordRequirements.hasSymbol}>
                記号を含む
              </RequirementItem>
            </PasswordRequirements>
          )}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="passwordConfirmation">
            パスワード（確認用）
          </Label>
          <InputWrapper>
            <PasswordInput
              id="passwordConfirmation"
              type={showPasswordConfirmation ? "text" : "password"}
              placeholder="もう一度入力してください"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={8}
            />
            <EyeButton
              type="button"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              aria-label={showPasswordConfirmation ? "パスワードを隠す" : "パスワードを表示"}
            >
              {showPasswordConfirmation ? <FiEyeOff /> : <FiEye />}
            </EyeButton>
          </InputWrapper>
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
