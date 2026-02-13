import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { apiClient } from "@/lib/api";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #f9fafb;
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
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  svg {
    width: 40px;
    height: 40px;
    color: #dc2626;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.6;
`;

const TimerBox = styled.div`
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
  width: 100%;
`;

const TimerLabel = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const TimerValue = styled.p`
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;

  span {
    font-size: 24px;
    color: #666;
    margin-left: 8px;
  }
`;

const HelpText = styled.p`
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-bottom: 24px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #4f46e5;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    text-decoration: underline;
    color: #4338ca;
  }
`;

const BlockedTemplate = () => {
  const router = useRouter();
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRateLimitStatus = async () => {
      try {
        const status = await apiClient.getRateLimitStatus();

        if (!status.blocked) {
          // ブロックされていない場合はログインページにリダイレクト
          router.push("/signin");
          return;
        }

        setRemainingMinutes(status.retryAfter);
        setLoading(false);
      } catch (error) {
        console.error("Failed to check rate limit status:", error);
        // エラー時はログインページにリダイレクト
        router.push("/signin");
      }
    };

    checkRateLimitStatus();

    // 1分ごとに更新
    const interval = setInterval(() => {
      setRemainingMinutes((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          router.push("/signin");
          return 0;
        }
        return prev - 1;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  if (loading || remainingMinutes === null) {
    return (
      <Wrapper>
        <Container>
          <p>読み込み中...</p>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <IconWrapper>
          <FiAlertTriangle />
        </IconWrapper>

        <Title>アクセスが制限されています</Title>

        <Description>
          ログイン試行回数が上限に達しました。
          <br />
          セキュリティ保護のため、一時的にアクセスが制限されています。
        </Description>

        <TimerBox>
          <TimerLabel>再試行まで</TimerLabel>
          <TimerValue>
            {remainingMinutes}
            <span>分</span>
          </TimerValue>
        </TimerBox>

        <HelpText>
          問題が解決しない場合は、サポートにお問い合わせください。
        </HelpText>

        <BackLink href="/signin">ログインページに戻る</BackLink>
      </Container>
    </Wrapper>
  );
};

export default BlockedTemplate;
