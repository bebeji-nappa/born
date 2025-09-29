import React, { FC } from "react";
import styled from "@emotion/styled";
import { Richmd } from "@richmd/react";
// @ts-ignore-next-line
import "@richmd/react/dist/richmd.css";

const StyledRichmd = styled(Richmd)`
  width: 100%;
  height: 100%;
  min-height: 400px;
  padding: 0 16px;
`;

export type PreviewProps = {
  text: string;
  id?: string;
};

const Preview: FC<PreviewProps> = ({ text }) => {
  return <StyledRichmd text={text} />;
};

export default Preview;
