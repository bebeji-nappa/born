import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";
import { verifyEmail as verifyEmailApi } from "../api";

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

const IconWrapper = styled.div<{ status: "loading" | "success" | "error" }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.status === "success"
      ? "#f0fdf4"
      : props.status === "error"
        ? "#fef2f2"
        : "#f3f4f6"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  svg {
    width: 40px;
    height: 40px;
    color: ${(props) =>
      props.status === "success"
        ? "#16a34a"
        : props.status === "error"
          ? "#dc2626"
          : "#9ca3af"};
    animation: ${(props) =>
      props.status === "loading" ? "spin 1s linear infinite" : "none"};
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    // 既に実行済みの場合はスキップ（React Strict Modeの2重実行を防ぐ）
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("確認トークンが見つかりません");
        return;
      }

      try {
        await verifyEmailApi(token);
        setStatus("success");
        setMessage("メールアドレスの確認が完了しました");
      } catch (error: unknown) {
        setStatus("error");
        const message =
          error instanceof Error
            ? error.message || "確認に失敗しました"
            : "確認に失敗しました";
        setMessage(
          message.includes("expired")
            ? "確認リンクの有効期限が切れています。再度サインアップしてください。"
            : message,
        );
      }
    };

    verifyEmail();
  }, [token]);

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

        <IconWrapper status={status}>
          {status === "loading" && <FiLoader />}
          {status === "success" && <FiCheckCircle />}
          {status === "error" && <FiXCircle />}
        </IconWrapper>

        <Title>
          {status === "loading" && "確認中..."}
          {status === "success" && "確認完了"}
          {status === "error" && "確認失敗"}
        </Title>

        <Description>
          {message || "メールアドレスを確認しています..."}
        </Description>

        {status === "success" && (
          <LinkButton href="/signin">ログインページへ</LinkButton>
        )}

        {status === "error" && (
          <LinkButton href="/signup">サインアップページへ</LinkButton>
        )}
      </Container>
    </Wrapper>
  );
};

export default VerifyEmail;
