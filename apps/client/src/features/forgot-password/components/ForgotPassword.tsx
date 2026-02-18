"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { forgotPassword } from "../api";

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
  line-height: 1.6;
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

const PrimaryButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

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

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await forgotPassword({ email });
      router.push("/forgot-password/sent");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err.message || "メールの送信に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
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

        <Title>パスワードをお忘れですか？</Title>
        <Subtitle>
          登録されているメールアドレスを入力してください。
          <br />
          パスワードリセット用のリンクをお送りします。
        </Subtitle>

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

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "送信"}
          </PrimaryButton>
        </Form>

        <LinkText>
          <Link href="/signin">ログインに戻る</Link>
        </LinkText>
      </Container>
    </Wrapper>
  );
};

export default ForgotPassword;
