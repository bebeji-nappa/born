import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Richmd } from 'richmd-react';
import 'richmd/richmd.css';
// import useStore from '@/store';

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
`;

const StyledRichmd = styled(Richmd)`
  width: 100%;
  padding: 0 16px;
`;

const PostCreateTemplate = () => {
  const [text, setText] = useState('# Hello World');
  const [isEdit, setIsEdit] = useState(true);
  // const user = useStore((state) => state.user);

  return (
    <>
      <button onClick={() => setIsEdit(!isEdit)}>
        {isEdit ? 'Preview' : 'Edit'}
      </button>
      {isEdit ? (
        <Textarea
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
          rows={50}
        />
      ) : (
        <StyledRichmd text={text} />
      )}
    </>
  );
};

export default PostCreateTemplate;
