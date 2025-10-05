"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import VerifyEmailChangeTemplate from "@/components/templates/VerifyEmailChange";

const VerifyEmailChangePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
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
  }, [searchParams]);

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
