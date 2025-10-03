import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export type LoadingSpinnerProps = {
  size?: number;
  color?: string;
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ size: number; color: string }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: 8px solid transparent;
  border-top: 8px solid ${(props) => props.color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 80,
  color = "#9ca3af",
}) => {
  return (
    <Wrapper>
      <Spinner size={size} color={color} />
    </Wrapper>
  );
};

export default LoadingSpinner;
