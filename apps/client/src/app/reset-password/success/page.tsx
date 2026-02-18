"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";

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
  max-width: 500px;
  padding: 40px;
  text-align: center;
`;

const LogoWrapper = styled.div`
  margin-bottom: 48px;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const CheckIcon = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #16a34a;
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 10px;
    top: 5px;
    width: 10px;
    height: 18px;
    border: solid #16a34a;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: #333333;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function ResetPasswordSuccessPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const redirectUrl = redirect === "account" ? "/setting/account" : "/signin";
  const buttonText =
    redirect === "account" ? "アカウント設定に戻る" : "ログイン";

  return (
    <>
      <PageTitle title="パスワードをリセットしました" />
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

          <IconWrapper>
            <CheckIcon />
          </IconWrapper>

          <Title>パスワードをリセットしました</Title>

          <Message>パスワードが正常にリセットされました。</Message>

          <LinkButton href={redirectUrl}>{buttonText}</LinkButton>
        </Container>
      </Wrapper>
    </>
  );
}
