import React from 'react';
import styled from '@emotion/styled';
import { Richmd } from '@richmd/react';
// @ts-ignore-next-line
import '@richmd/react/dist/richmd.css';

const StyledRichmd = styled(Richmd)`
  width: 100%;
  padding: 0 16px;
`;

const Preview = ({ text }) => {
  return <StyledRichmd text={text} />;
};

export default Preview;
