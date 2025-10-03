"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "@emotion/styled";

const StyledPageHeader = styled.header`
  background: #ffffff;
  padding: 10px 24px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const LogoContainer = styled.div`
  display: block;
  position: relative;
  width: 140px;
  height: 35px;
`;

export const PageHeader = () => {
  return (
    <StyledPageHeader>
      <LogoContainer>
        {/* TODO: サービスのトップページが完成したら、コメントアウト外す */}
        {/* <Link href="/">
          <Image
            src="/born_logo.svg"
            alt="logo"
            sizes="100vw"
            fill
            style={{
              width: "100%",
            }}
          />
        </Link> */}
        <Image
          src="/born_logo.svg"
          alt="logo"
          sizes="100vw"
          fill
          style={{
            width: "100%",
          }}
        />
      </LogoContainer>
    </StyledPageHeader>
  );
};
