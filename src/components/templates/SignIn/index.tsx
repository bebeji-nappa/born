import React from "react";
import styled from '@emotion/styled';
import { useForm } from "react-hook-form";
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

export type SignInInputs = {
  email: string;
  password: string;
}

const SignInTemplate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInInputs>();
  const { onSubmit } = useSignIn();

  return (
    <Wrapper>
      <h1>Sign In</h1>
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

export default SignInTemplate;
