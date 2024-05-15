import React, { Children } from "react";

type props = {
  className?: string;
  children: React.ReactNode;
};

export default function ErrorComponent({ className, children }: props) {
  return (
    <div className={`text-red-600 text-center text-sm ${className}`}>
      {children}
    </div>
  );
}
