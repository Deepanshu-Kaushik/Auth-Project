import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
}

export default function AuthTitle({className, children}: Props) {
  return <h1 className={`my-2 text-2xl md:my-3 md:text-3xl ${className}`}>{children}</h1>;
}
