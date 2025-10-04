"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const StyledPageHeader = styled.header`
  background: #ffffff;
  padding: 10px 24px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: block;
  position: relative;
  width: 140px;
  height: 35px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CreatePostButton = styled.button`
  padding: 8px 16px;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #ea580c;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const AvatarButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  overflow: hidden;
  background: #f3f4f6;
  transition: border-color 0.2s;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  min-width: 200px;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: ${(props) => (props.isOpen ? "translateY(0)" : "translateY(-8px)")};
  transition: all 0.2s ease-in-out;
  z-index: 1000;
`;

const MenuItem = styled.button<{ hasBorderTop?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
  border-top: ${(props) => (props.hasBorderTop ? "1px solid #e5e7eb" : "none")};

  &:first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &:hover {
    background-color: #f3f4f6;
  }

  &:focus {
    outline: none;
    background-color: #f3f4f6;
  }
`;

export const PageHeader = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuItemClick = (action: () => void) => {
    setIsMenuOpen(false);
    action();
  };

  return (
    <StyledPageHeader>
      <HeaderContent>
        <LogoContainer>
          <Link href="/">
            <Image
              src="/born_logo.svg"
              alt="logo"
              sizes="100vw"
              fill
              style={{
                width: "100%",
              }}
            />
          </Link>
        </LogoContainer>

        {isAuthenticated && user?.name && (
          <RightSection>
            <CreatePostButton onClick={() => window.location.href = "/post/create"}>
              記事を作成
            </CreatePostButton>

            <UserMenuContainer ref={menuRef}>
              <AvatarButton
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="ユーザーメニュー"
                aria-expanded={isMenuOpen}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </AvatarButton>

              <DropdownMenu isOpen={isMenuOpen}>
                <MenuItem onClick={() => handleMenuItemClick(() => window.location.href = `/${user.screen_name}`)}>
                  自分のブログを確認
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(() => window.location.href = "/post/list")}>
                  記事の管理
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(() => window.location.href = "/setting/account")}>
                  アカウント設定
                </MenuItem>
                <MenuItem
                  hasBorderTop
                  onClick={() => handleMenuItemClick(signOut)}
                >
                  ログアウト
                </MenuItem>
              </DropdownMenu>
            </UserMenuContainer>
          </RightSection>
        )}
      </HeaderContent>
    </StyledPageHeader>
  );
};
