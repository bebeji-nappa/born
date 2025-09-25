import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { useTextField } from 'react-aria';
import { useBoolean } from 'ahooks';
import { useForm } from 'react-hook-form';
import Preview from './parts/Preview';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 20px auto 0;
  gap: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 100%;
  outline: none;
  font-size: 20px;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  resize: none;
  height: 25rem;
  border: none;
  width: 100%;
  outline: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubmitButton = styled.button`
  width: 300px;
  background-color: #0366d6;
  color: white;
  font-weight: 600;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
`;

const EditorWrapper = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e5e9;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.isActive ? '#0366d6' : 'transparent')};
  color: ${(props) => (props.isActive ? '#0366d6' : '#586069')};
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #0366d6;
    background-color: #f6f8fa;
  }
`;

export type PostCreateInputValues = {
  content: string;
};

const PostCreateTemplate = () => {
  const [text, setText] = useState('# Hello World');
  const [isEdit, { toggle: handleIsEdit }] = useBoolean(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { handleSubmit } = useForm({
    defaultValues: {
      content: text,
    },
  });

  const onSubmit = (e: any) => {
    console.log(e);
  };

  const handleTabClick = useCallback(
    (isEditMode: boolean) => {
      if (isEdit !== isEditMode) {
        handleIsEdit();
      }
    },
    [isEdit, handleIsEdit],
  );

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

  return (
    <Wrapper>
      <h1>新規投稿</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">タイトル</Label>
        <Input id="title" type="text" placeholder="記事タイトルを入力..." />

        <Label htmlFor="content">内容</Label>
        <EditorWrapper id="content">
          <TabContainer>
            <Tab isActive={isEdit} onClick={() => handleTabClick(true)}>
              Edit
            </Tab>
            <Tab isActive={!isEdit} onClick={() => handleTabClick(false)}>
              Preview
            </Tab>
          </TabContainer>

          {isEdit ? (
            <Textarea defaultValue={text} {...inputProps} />
          ) : (
            <Preview text={text} />
          )}
        </EditorWrapper>
        <SubmitButton type="submit">送信</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default PostCreateTemplate;
