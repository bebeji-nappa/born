"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const Background = styled.div`
  background: #ffd600;
  min-height: 100vh;
  position: relative;
`;

const PageHeader = styled.header`
  background: #000;
  padding: 16px 24px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  width: 100vw;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
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
  background-color: #fff;
  border-radius: 12px;
  min-height: calc(80vh - 48px);
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0 0 20px 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Content = styled.div`
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

export default function NotFound() {
  return (
    <Background>
      <PageHeader>
        <div
          style={{
            display: "block",
            position: "relative",
            width: "200px",
            height: "50px",
          }}
        >
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              sizes="100vw"
              fill
              style={{
                width: "100%",
              }}
            />
          </Link>
        </div>
      </PageHeader>
      <Container>
        <Article>
          <Content>
            <Title>404 - Page Not Found</Title>
          </Content>
        </Article>
      </Container>
    </Background>
  );
}
