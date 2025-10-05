import React, { FC } from "react";
import styled from "@emotion/styled";
import Link from "next/link";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 48px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 860px) {
    padding: 32px 24px;
  }
`;

const Icon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 12px 32px;
  background-color: #000000;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333333;
  }
`;

const ErrorIcon = styled(Icon)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
`;

export type VerifyEmailChangeTemplateProps = {
  success: boolean;
  message: string;
};

const VerifyEmailChangeTemplate: FC<VerifyEmailChangeTemplateProps> = ({
  success,
  message,
}) => {
  return (
    <Wrapper>
      <Card>
        {success ? (
          <>
            <Icon>✓</Icon>
            <Title>メールアドレス変更完了</Title>
            <Description>{message}</Description>
          </>
        ) : (
          <>
            <ErrorIcon>✗</ErrorIcon>
            <Title>メールアドレス変更失敗</Title>
            <Description>{message}</Description>
          </>
        )}
        <HomeButton href="/">ホームに戻る</HomeButton>
      </Card>
    </Wrapper>
  );
};

export default VerifyEmailChangeTemplate;
