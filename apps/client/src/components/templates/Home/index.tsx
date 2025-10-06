"use client";

import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #ffffff;
`;

const LogoImageContainer = styled.div`
  position: relative;
  width: 280px;
  height: 80px;

  @media (max-width: 860px) {
    width: 220px;
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 860px) {
    font-size: 36px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  color: #666666;
  text-align: center;
  max-width: 700px;
  margin-bottom: 48px;
  line-height: 1.6;

  @media (max-width: 860px) {
    font-size: 16px;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 16px 48px;
  background: #000000;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 48px;
`;

const BetaBadge = styled.span`
  padding: 2px 8px;
  background-color: #9effdf;
  color: #10b981;
  border: 1px solid #10b981;
  border-radius: 12px;
  font-size: 12px;
`;

const Footer = styled.footer`
  background: #1f2937;
  color: #9ca3af;
  padding: 24px 20px;
  text-align: center;
`;

const Copyright = styled.p`
  font-size: 14px;
  margin: 0;

  a {
    color: #9ca3af;
    text-decoration: none;

    &:hover {
      color: #d1d5db;
      text-decoration: underline;
    }
  }
`;

const HomeTemplate = () => {
  const { user } = useAuth();

  // ユーザーがログイン済みの場合はブログトップページへ、未ログインの場合はサインインページへ
  const ctaHref = user && user.screen_name ? `/${user.screen_name}` : "/signin";

  return (
    <Wrapper>
      <MainContent>
        <LogoContainer>
          <LogoImageContainer>
            <Image
              src="/born_logo.svg"
              alt="Born Logo"
              sizes="100vw"
              fill
              style={{
                width: "100%",
                objectFit: "contain",
              }}
              priority
            />
          </LogoImageContainer>
          <BetaBadge>ベータ版</BetaBadge>
        </LogoContainer>

        <Title>あなたの発想を、形にする</Title>

        <Description>
          Bornは、Markdown でシンプルに書けるブログ型プラットフォームです。
          <br />
          あなたのアイデアや体験を、自由に表現し、色々な人々と共有しましょう。
        </Description>

        <CTAButton href={ctaHref}>はじめる</CTAButton>
      </MainContent>

      <Footer>
        <Copyright>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://born-docs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            born-docs.com
          </a>
          . All rights reserved.
        </Copyright>
      </Footer>
    </Wrapper>
  );
};

export default HomeTemplate;
