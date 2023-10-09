import React, { useRef } from "react";
import { useButton } from "react-aria";

export type BorderdButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

const BorderdButton: React.FC<BorderdButtonProps> = (({
  children,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return <button ref={ref} {...buttonProps}>
    {children}
  </button>;
});

export default BorderdButton;
