import styled from "@emotion/styled";
import Link from "next/link";
import type { FC } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

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

const IconWrapper = styled.div<{ success: boolean }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background-color: ${(props) => (props.success ? "#f0fdf4" : "#fef2f2")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: ${(props) => (props.success ? "#16a34a" : "#dc2626")};
  }
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
        <IconWrapper success={success}>
          {success ? <FiCheckCircle /> : <FiXCircle />}
        </IconWrapper>

        <Title>
          {success ? "メールアドレス変更完了" : "メールアドレス変更失敗"}
        </Title>

        <Description>{message}</Description>

        <HomeButton href="/setting/account">アカウント設定に戻る</HomeButton>
      </Card>
    </Wrapper>
  );
};

export default VerifyEmailChangeTemplate;
