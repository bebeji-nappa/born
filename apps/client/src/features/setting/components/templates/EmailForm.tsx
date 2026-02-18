import styled from "@emotion/styled";
import type React from "react";
import { type FC, useEffect, useState } from "react";
import type { User } from "@/features/shared/utils/api";
import { getPendingEmailChange, requestEmailChange } from "../../api/account";

const Section = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const EmailDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EmailText = styled.p`
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  width: 100%;
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #000000;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  align-self: center;
  width: 120px;
  background-color: #000000;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #333333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e1e5e9;
  color: #333;

  &:hover {
    background-color: #cbd5e0;
  }
`;

const SuccessMessage = styled.p`
  font-size: 14px;
  color: #16a34a;
  background-color: #d1fae5;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 8px;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: #dc2626;
  margin-top: 8px;
`;

const PendingInfo = styled.div`
  background-color: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

const PendingText = styled.p`
  font-size: 14px;
  color: #92400e;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PendingEmail = styled.span`
  font-weight: 600;
`;

export type EmailFormProps = {
  user: User;
};

const EmailForm: FC<EmailFormProps> = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const checkPending = async () => {
      try {
        const result = await getPendingEmailChange();
        if (result.pending && result.newEmail) {
          setIsPending(true);
          setPendingEmail(result.newEmail);
        } else {
          setIsPending(false);
          setPendingEmail(null);
        }
      } catch (error) {
        console.error("Failed to check pending email change:", error);
      }
    };

    checkPending();
  }, []);

  const handleCancel = () => {
    setShowForm(false);
    setEmail("");
    setError(null);
    setSuccess(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await requestEmailChange(email);
      setSuccess(
        "確認メールを送信しました。メール内のリンクをクリックして変更を完了してください。",
      );
      setEmail("");
      setShowForm(false);
      // 確認待ち状態を更新
      const result = await getPendingEmailChange();
      if (result.pending && result.newEmail) {
        setIsPending(true);
        setPendingEmail(result.newEmail);
      }
    } catch (err) {
      console.error("Email change request error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("メールアドレス変更リクエストの送信に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <SectionTitle>メールアドレスを変更</SectionTitle>
      {isPending && pendingEmail && (
        <PendingInfo>
          <PendingText>
            変更後のメールアドレス: <PendingEmail>{pendingEmail}</PendingEmail>
          </PendingText>
          <PendingText>
            確認メールを送信済みです。メール内のリンクをクリックして変更を完了してください。
          </PendingText>
        </PendingInfo>
      )}
      {!showForm ? (
        <EmailDisplay>
          <EmailText>{user.email}</EmailText>
          <Button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={isPending}
          >
            変更する
          </Button>
        </EmailDisplay>
      ) : (
        <>
          <Form onSubmit={onSubmit}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="新しいメールアドレスを入力してください"
              required
            />
            <ButtonGroup>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "送信中..." : "送信"}
              </Button>
              <CancelButton
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </CancelButton>
            </ButtonGroup>
          </Form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </>
      )}
    </Section>
  );
};

export default EmailForm;
