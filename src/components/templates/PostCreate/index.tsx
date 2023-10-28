import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { useButton, useTextField } from 'react-aria';
import { useBoolean } from 'ahooks';
import { useForm } from 'react-hook-form';
import Preview from './parts/Preview';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Textarea = styled.textarea`
  padding: 8px;
  resize: none;
  width: 70%;
  height: 25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  width: 300px;
`;

const SubmitButton = styled.button`
  width: 300px;
`;

export type PostCreateInputValues = {
  content: string;
};

const PostCreateTemplate = () => {
  const [text, setText] = useState('# Hello World');
  const [isEdit, { toggle: handleIsEdit }] = useBoolean(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { handleSubmit } = useForm({
    defaultValues: {
      content: text,
    },
  });

  const onSubmit = (e) => {
    console.log(e);
  };

  const handleChange = useCallback((value: string) => {
    setText(value);
  }, []);

  const { inputProps } = useTextField(
    {
      name: 'content',
      placeholder: '記事内容を入力...',
      value: text,
      onChange: handleChange,
      inputElementType: 'textarea',
    },
    inputRef,
  );

  const { buttonProps } = useButton(
    {
      onPress: handleIsEdit,
    },
    buttonRef,
  );

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {isEdit ? (
          <Textarea defaultValue={text} {...inputProps} />
        ) : (
          <Preview text={text} />
        )}
        <Button {...buttonProps}>{isEdit ? 'Preview' : 'Edit'}</Button>
        <SubmitButton type="submit">送信</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default PostCreateTemplate;
