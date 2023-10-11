import React from "react";
import styled from '@emotion/styled';

import { useSignIn } from "./logic";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  width: 30%;
  display: flex;
  flex-direction: column;
`;

const GitHubButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
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
      <GitHubButton onClick={githubSignIn}>Sign in of GitHub</GitHubButton>
    </Wrapper>
  );
}

export default SignInTemplate;
