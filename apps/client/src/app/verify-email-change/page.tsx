"use client";

import { useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { verifyEmailChange } from "@/features/verify-email-change/api/verify-email-change";
import VerifyEmailChange from "@/features/verify-email-change/components/views/VerifyEmailChange";
import { useAuth } from "@/utils/contexts/AuthContext";

const VerifyEmailChangePage: React.FC = () => {
  const searchParams = useSearchParams();
  const { refetch } = useAuth();
  const [verificationState, setVerificationState] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    // 既に実行済みの場合はスキップ（React Strict Modeの2重実行を防ぐ）
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setVerificationState({
          success: false,
          message: "無効なリンクです。",
        });
        return;
      }

      try {
        const result = await verifyEmailChange(token);
        if (result.success) {
          await refetch();
        }
        setVerificationState({
          success: result.success,
          message: result.message || "メールアドレスが正常に変更されました。",
        });
      } catch (error) {
        setVerificationState({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "メールアドレスの変更に失敗しました。",
        });
      }
    };

    verifyEmail();
  }, [searchParams, refetch]);

  if (!verificationState) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <p>確認中...</p>
      </div>
    );
  }

  return (
    <VerifyEmailChange
      success={verificationState.success}
      message={verificationState.message}
    />
  );
};

export default VerifyEmailChangePage;
