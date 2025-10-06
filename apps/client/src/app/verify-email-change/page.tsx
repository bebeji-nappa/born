"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import VerifyEmailChangeTemplate from "@/components/templates/VerifyEmailChange";

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
        const result = await apiClient.verifyEmailChange(token);
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
    <VerifyEmailChangeTemplate
      success={verificationState.success}
      message={verificationState.message}
    />
  );
};

export default VerifyEmailChangePage;
