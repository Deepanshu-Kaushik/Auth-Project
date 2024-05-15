import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function Card({ className, children }: Props) {
  return (
    <div
      className={`w-[300px] md:w-[400px] rounded-md shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)] p-10 my-6 ${className}`}
    >
      {children}
    </div>
  );
}
