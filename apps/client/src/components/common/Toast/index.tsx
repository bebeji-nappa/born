"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { IoClose } from "react-icons/io5";

type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: ToastType; isClosing?: boolean }>`
  position: fixed;
  top: 80px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  animation: ${(props) => (props.isClosing ? fadeOut : slideIn)}
    ${(props) => (props.isClosing ? "0.2s" : "0.3s")} ease-out;
  background-color: ${(props) =>
    props.type === "success" ? "#d1fae5" : "#fee2e2"};
  color: ${(props) => (props.type === "success" ? "#059669" : "#dc2626")};

  @media (max-width: 860px) {
    right: 16px;
    left: auto;
    min-width: 300px;
    max-width: calc(100% - 32px);
  }
`;

const Message = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button<{ toastType: ToastType }>`
  background: none;
  border: none;
  color: ${(props) => (props.toastType === "success" ? "#059669" : "#dc2626")};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 20px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const Toast = ({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 200); // フェードアウト時間と同じ
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <ToastContainer type={type} isClosing={isClosing}>
      <Message>{message}</Message>
      <CloseButton toastType={type} onClick={handleClose}>
        <IoClose />
      </CloseButton>
    </ToastContainer>
  );
};
