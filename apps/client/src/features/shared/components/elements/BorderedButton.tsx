import type React from "react";
import { useRef } from "react";
import { useButton } from "react-aria";

export type BorderedButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

const BorderedButton: React.FC<BorderedButtonProps> = ({
  children,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    <button ref={ref} {...buttonProps}>
      {children}
    </button>
  );
};

export default BorderedButton;
