import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { useButton, useTextField } from 'react-aria';
import { useBoolean } from 'ahooks';
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

const Button = styled.button`
  width: 300px;
`;

const PostCreateTemplate = () => {
  const [text, setText] = useState('# Hello World');
  const [isEdit, { toggle: handleIsEdit }] = useBoolean(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((value: string) => {
    setText(value);
  }, []);

  const { inputProps } = useTextField({
    placeholder: '記事内容を入力...',
    value: text,
    inputElementType: 'textarea',
    onChange: handleChange,
  }, inputRef);

  const { buttonProps } = useButton(
    {
      onPress: handleIsEdit,
    },
    buttonRef,
  );

  return (
    <Wrapper>
      <Button {...buttonProps}>{isEdit ? 'Preview' : 'Edit'}</Button>
      {isEdit ? (
        <Textarea
          defaultValue={text}
          {...inputProps}
        />
      ) : (
        <Preview text={text} />
      )}
    </Wrapper>
  );
};

export default PostCreateTemplate;
