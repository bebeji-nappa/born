import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useButton } from 'react-aria';
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
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps } = useButton(
    {
      onPress: handleIsEdit,
    },
    ref,
  );

  return (
    <Wrapper>
      <Button {...buttonProps}>{isEdit ? 'Preview' : 'Edit'}</Button>
      {isEdit ? (
        <Textarea
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <Preview text={text} />
      )}
    </Wrapper>
  );
};

export default PostCreateTemplate;
