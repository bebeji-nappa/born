import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSignIn } from "../logic";

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

const ErrorMessage = styled.div`
  width: 100%;
  padding: 12px 16px;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 14px;
  border-radius: 8px;
  margin-bottom: 16px;
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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #ffde59;
  }

  &::placeholder {
    color: #999;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
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
  background-color: #000000;
  color: #ffffff;
  margin-top: 8px;

  &:hover {
    background-color: #333333;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #999;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
  }
`;

const GitHubButton = styled(Button)`
  background-color: #24292f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #1c2127;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LinkText = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 16px;

  a {
    color: #000000;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export type SignInInputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { githubSignIn, emailSignIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errorMessage = await emailSignIn(email, password);
    if (errorMessage) {
      setError(errorMessage);
    }
  };

  return (
    <Wrapper>
      <Container>
        <LogoWrapper>
          <Link href="/">
            <Image
              src="/born_logo.svg"
              alt="Born Logo"
              width={180}
              height={60}
              priority
            />
          </Link>
        </LogoWrapper>

        <Title>ログイン</Title>
        <Subtitle>アカウントにログインしてください</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "パスワードを隠す" : "パスワードを表示"
                }
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </EyeButton>
            </InputWrapper>
          </InputGroup>

          <LinkText style={{ marginTop: 0, textAlign: "right" }}>
            <Link href="/forgot-password">パスワードをお忘れですか？</Link>
          </LinkText>

          <PrimaryButton type="submit">ログイン</PrimaryButton>
        </Form>

        {/* <Divider>または</Divider>

        <GitHubButton type="button" onClick={githubSignIn}>
          <Image
            src="/images/github-mark-white.svg"
            alt="GitHub Logo"
            width={20}
            height={20}
          />
          GitHub でログイン
        </GitHubButton> */}

        <LinkText>
          アカウントをお持ちでない方は <Link href="/signup">新規登録</Link>
        </LinkText>
      </Container>
    </Wrapper>
  );
};

export default SignIn;
