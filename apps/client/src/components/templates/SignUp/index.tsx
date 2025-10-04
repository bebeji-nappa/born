import React, { useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { apiClient } from "@/lib/api";
import { validatePassword } from "@/lib/validation";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
  @supports (height: 100svh) {
    height: 100svh;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 40px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
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
    border-color: #f97316;
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
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background-color: #f97316;
  color: #ffffff;
  margin-top: 8px;

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
  text-align: center;
`;

const SuccessMessage = styled.p`
  font-size: 14px;
  color: #16a34a;
  text-align: center;
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

const LinkText = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 16px;

  a {
    color: #f97316;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUpTemplate = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
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

    // バリデーション
    if (!email || !password || !passwordConfirmation) {
      setError("全ての項目を入力してください");
      return;
    }

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
      await apiClient.signUp({
        email,
        password,
        passwordConfirmation,
      });
      setSuccess("アカウントを作成しました。ログインページに移動します...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(
        err.message || "アカウント作成に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <LogoWrapper>
          <Image
            src="/born_logo.svg"
            alt="Born Logo"
            width={180}
            height={60}
            priority
          />
        </LogoWrapper>

        <Title>新規登録</Title>
        <Subtitle>アカウントを作成してください</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">パスワード</Label>
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

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "登録中..." : "アカウントを作成"}
          </PrimaryButton>
        </Form>

        <LinkText>
          すでにアカウントをお持ちですか？{" "}
          <Link href="/signin">ログイン</Link>
        </LinkText>
      </Container>
    </Wrapper>
  );
};

export default SignUpTemplate;
