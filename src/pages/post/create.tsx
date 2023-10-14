import React from 'react';
import useStore from '@/store';

const PostCreate = () => {
  const user = useStore((state) => state.user);

  return (
    <div>
      <h1>PostCreate</h1>
      <p>ユーザーID: {user.id}</p>
      <p>ユーザーメール: {user.email}</p>
      <p>ユーザー名: {user.name}</p>
    </div>
  );
};

export default PostCreate;
