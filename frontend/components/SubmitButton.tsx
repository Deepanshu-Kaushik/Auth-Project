import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function SubmitButton({ className, children, disabled, onClick }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`select-none text-white font-semibold bg-sky-600 text-sm rounded-full p-3 md:p-4 mt-4 md:mt-6 active:bg-sky-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
