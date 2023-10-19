import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { useSignIn } from './logic';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  @supports (height: 100svh) {
    height: 100svh;
  }
  width: 100vw;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50vw;
`;

const SigninImage = styled.div`
  position: relative;
  width: 50vw;
  height: 100vh;
  background-image: url('/images/sign-in-background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
`;

const Title = styled.h1`
  font-size: 24px;
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
};

const SignInTemplate = () => {
  const { githubSignIn } = useSignIn();

  return (
    <Wrapper>
      <SigninImage />
      <Container>
        <Title>Sign In</Title>
        <GitHubButton onClick={githubSignIn}>
          <Image
            src="/images/github-mark-white.svg"
            alt="GitHub Logo"
            width={20}
            height={18}
          />
          Sign in of GitHub
        </GitHubButton>
      </Container>
    </Wrapper>
  );
};

export default SignInTemplate;
