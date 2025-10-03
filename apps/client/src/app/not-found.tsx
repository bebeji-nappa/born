"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const Background = styled.div`
  background: #ffffff;
  min-height: 100vh;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Article = styled.article`
  min-height: calc(80vh - 48px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  width: 400px;
  height: 200px;

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ErrorText = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export default function NotFound() {
  return (
    <Background>
      <Container>
        <Article>
          <Content>
            <LogoContainer>
              <Image
                src="/born_logo.svg"
                alt="born logo"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </LogoContainer>
            <ErrorText>404 Not Found</ErrorText>
          </Content>
        </Article>
      </Container>
    </Background>
  );
}
