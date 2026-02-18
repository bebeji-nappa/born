import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiMail } from "react-icons/fi";

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
  margin-bottom: 32px;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  svg {
    width: 40px;
    height: 40px;
    color: #16a34a;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  width: 100%;
`;

const InfoTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #4f46e5;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const InfoItem = styled.li`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: "•";
    color: #4f46e5;
    font-weight: bold;
    margin-top: 2px;
  }
`;

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: #000000;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: #333333;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const HelpText = styled.p`
  font-size: 14px;
  color: #999;
  margin-top: 24px;
`;

const EmailSent = () => {
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

        <IconWrapper>
          <FiCheckCircle />
        </IconWrapper>

        <Title>確認メールを送信しました</Title>
        <Description>
          ご登録いただいたメールアドレスに確認メールを送信しました。
          <br />
          メール内のリンクをクリックして、アカウントの登録を完了してください。
        </Description>

        <InfoBox>
          <InfoTitle>
            <FiMail />
            次のステップ
          </InfoTitle>
          <InfoList>
            <InfoItem>
              メールボックスを確認してください（迷惑メールフォルダも確認してください）
            </InfoItem>
            <InfoItem>
              メール内の「メールアドレスを確認」ボタンをクリックしてください
            </InfoItem>
            <InfoItem>確認が完了したら、ログインできるようになります</InfoItem>
          </InfoList>
        </InfoBox>

        <LinkButton href="/signin">ログインページへ</LinkButton>

        <HelpText>※確認リンクの有効期限は24時間です</HelpText>
      </Container>
    </Wrapper>
  );
};

export default EmailSent;
