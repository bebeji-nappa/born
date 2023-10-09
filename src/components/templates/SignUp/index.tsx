import React, { useCallback } from "react";
import { trpc } from '@/utils/trpc';
import BorderdButton from '@/components/common/BorderdButton';
import styled from '@emotion/styled';
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  width: 30%;
  display: flex;
  flex-direction: column;
`;

export type SignUpInputs = {
  email: string;
  password: string;
}

const SignUpTemplate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpInputs>();

  const mutation = trpc.signUp.useMutation();
  const onSubmit: SubmitHandler<SignUpInputs> = useCallback(async ({
    email,
    password,
  }) => {
    mutation.mutate({ email, password });
  }, [mutation]);

  return (
    <Wrapper>
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label>email</label>
        <input type="email" {...register("email", { required: true })} />
        <label>password</label>
        <input type="password" {...register("password", { required: true })} />
        <input type="submit" />
      </Form>
    </Wrapper>
  );
}

export default SignUpTemplate;
