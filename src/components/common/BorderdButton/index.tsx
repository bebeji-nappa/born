import React, { useRef } from "react";
import { useButton } from "react-aria";

const BorderdButton: React.FC = ((props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return <button ref={ref} {...buttonProps} />;
});

export default BorderdButton;
