import styled from "@emotion/styled";
import { type FC, useState } from "react";
import { useToast } from "@/hooks/useToast";
import type { User } from "@/utils/api";
import { useAuth } from "@/utils/contexts/AuthContext";
import { updateUserAvatar } from "../api";
import AvatarUploadForm from "./AvatarUploadForm";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import ProfileForm from "./ProfileForm";
import ScreenNameForm from "./ScreenNameForm";

// import GitHubConnectForm from "./GitHubConnectForm";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ProfileFormWrapper = styled.section`
  display: flex;
  justify-content: space-around;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 24px;
`;

interface Props {
  user: User;
}

const AccountSetting: FC<Props> = ({ user }) => {
  const { refetch } = useAuth();
  const { showToast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.image || null,
  );

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast("画像サイズは2MB以下にしてください", "error");
      return;
    }

    // ファイルタイプチェック
    if (
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type,
      )
    ) {
      showToast(
        "JPEG、PNG、GIF、WebP形式の画像のみアップロード可能です",
        "error",
      );
      return;
    }

    try {
      const result = await updateUserAvatar(file);
      setAvatarPreview(result.url);
      // ヘッダーのアバターを更新
      await refetch();
    } catch (err) {
      console.error("Avatar update error:", err);
      showToast("アバター画像の更新に失敗しました", "error");
    }
  };

  return (
    <Wrapper>
      <Title>アカウント設定</Title>
      <ProfileFormWrapper>
        <AvatarUploadForm
          user={user}
          avatarPreview={avatarPreview}
          onAvatarChange={handleAvatarChange}
        />
        <ProfileForm user={user} />
      </ProfileFormWrapper>

      <ScreenNameForm user={user} />

      <EmailForm user={user} />

      {/* <GitHubConnectForm user={user} /> */}

      <PasswordForm />
    </Wrapper>
  );
};

export default AccountSetting;
