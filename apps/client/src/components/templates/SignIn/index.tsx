import React, { useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useSignIn } from "./logic";

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
    content: "";
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

export type SignInInputs = {
  email: string;
  password: string;
};

const SignInTemplate = () => {
  const { githubSignIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API実装は別途対応予定
    console.log("Login attempt:", { email, password });
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

        <Title>ログイン</Title>
        <Subtitle>アカウントにログインしてください</Subtitle>

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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <PrimaryButton type="submit">ログイン</PrimaryButton>
        </Form>

        <Divider>または</Divider>

        <GitHubButton type="button" onClick={githubSignIn}>
          <Image
            src="/images/github-mark-white.svg"
            alt="GitHub Logo"
            width={20}
            height={20}
          />
          GitHub でログイン
        </GitHubButton>
      </Container>
    </Wrapper>
  );
};

export default SignInTemplate;
