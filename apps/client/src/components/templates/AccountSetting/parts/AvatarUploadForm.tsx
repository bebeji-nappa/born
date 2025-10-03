import React, { FC, useRef, ChangeEvent } from "react";
import styled from "@emotion/styled";
import { User } from "@/lib/api";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
  background: white;
  padding: 24px 36px;
`;

const AvatarImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e1e5e9;
`;

const AvatarPlaceholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  font-weight: 600;
`;

const UploadButton = styled.label`
  background-color: #ffffff;
  color: #24292e;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;

  &:hover {
    background-color: #f6f8fa;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

export type AvatarUploadFormProps = {
  user: User;
  avatarPreview: string | null;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const AvatarUploadForm: FC<AvatarUploadFormProps> = ({
  user,
  avatarPreview,
  onAvatarChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Section>
      {avatarPreview ? (
        <AvatarImage src={avatarPreview} alt="Avatar" />
      ) : (
        <AvatarPlaceholder>{getInitials(user.name)}</AvatarPlaceholder>
      )}
      <div>
        <UploadButton htmlFor="avatar-upload">画像を変更</UploadButton>
        <HiddenInput
          id="avatar-upload"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onAvatarChange}
          disabled={disabled}
        />
      </div>
    </Section>
  );
};

export default AvatarUploadForm;
