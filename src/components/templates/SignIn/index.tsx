import React, { useCallback } from "react";
import { trpc } from '@/utils/trpc';
import BorderdButton from '@/components/common/BorderdButton';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SignInTemplate = () => {
  const mutation = trpc.signIn.useMutation();
  const handleLogin = useCallback(async () => {
    const email = 'example@example.com';
    const password = 'password';
    mutation.mutate({ email, password });
  }, [mutation]);

  return (
    <Wrapper>
      <h1>SignIn</h1>
      <BorderdButton onPress={handleLogin}>送信</BorderdButton>
    </Wrapper>
  );
}

export default SignInTemplate;
