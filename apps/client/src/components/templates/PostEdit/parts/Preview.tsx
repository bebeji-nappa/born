import React, { FC } from "react";
import styled from "@emotion/styled";
import { Richmd } from "@richmd/react";
// @ts-ignore-next-line
import "@richmd/react/dist/richmd.css";

const StyledRichmd = styled(Richmd)<{ textColor?: string; linkColor?: string }>`
  width: 100%;
  padding: 0 16px;

  ${(props) =>
    props.textColor &&
    `
    color: ${props.textColor};

    .richmd p, li, td, th, blockquote, code, pre, h1, h2, h3, h4, h5, h6 {
      color: ${props.textColor};
    }
  `}

  ${(props) =>
    props.linkColor &&
    `
    .richmd .a {
      color: ${props.linkColor};
    }
  `}
`;

export type PreviewProps = {
  text: string;
  textColor?: string;
  linkColor?: string;
};

const Preview: FC<PreviewProps> = ({ text, textColor, linkColor }) => {
  return (
    <StyledRichmd text={text} textColor={textColor} linkColor={linkColor} />
  );
};

export default Preview;
