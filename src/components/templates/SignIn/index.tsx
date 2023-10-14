import React from "react";
import styled from '@emotion/styled';
import Image from 'next/image';
import { useSignIn } from "./logic";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const GitHubButton = styled.button`
  background-color: #24292f;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 20px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export type SignInInputs = {
  email: string;
  password: string;
}

const SignInTemplate = () => {
  const { githubSignIn } = useSignIn();

  return (
    <Wrapper>
      <h1>Sign In</h1>
      <GitHubButton onClick={githubSignIn}>
        <Image src="./github-mark-white.svg" alt="GitHub Logo" width={20} height={18} />
        Sign in of GitHub
      </GitHubButton>
    </Wrapper>
  );
}

export default SignInTemplate;
