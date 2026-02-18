import styled from "@emotion/styled";
import type { FC } from "react";
import type { User } from "@/utils/api";

const FormSection = styled.section`
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ConnectButton = styled.button`
  padding: 12px 24px;
  background: #24292f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1c2127;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ReConnectButton = styled.button`
  padding: 12px;
  background: #24292f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1c2127;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ConnectedStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatusText = styled.div`
  color: #16a34a;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "✓";
    font-weight: bold;
  }
`;

const GitHubIdRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const GitHubIdText = styled.div`
  font-size: 16px;
  color: #6b7280;

  span {
    font-weight: 500;
    color: #111827;
  }
`;

interface Props {
  user: User;
}

const GitHubConnectForm: FC<Props> = ({ user }) => {
  const handleConnect = () => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${apiBaseUrl}/api/auth/connect/github`;
  };

  return (
    <FormSection>
      <SectionTitle>GitHub連携</SectionTitle>
      {user.github_id ? (
        <ConnectedStatus>
          <StatusText>GitHubアカウントと連携済み</StatusText>
          <GitHubIdRow>
            <GitHubIdText>
              GitHub ID: <span>{user.github_id}</span>
            </GitHubIdText>
            <ReConnectButton onClick={handleConnect}>再連携</ReConnectButton>
          </GitHubIdRow>
        </ConnectedStatus>
      ) : (
        <ConnectButton onClick={handleConnect}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHubと連携する
        </ConnectButton>
      )}
    </FormSection>
  );
};

export default GitHubConnectForm;
