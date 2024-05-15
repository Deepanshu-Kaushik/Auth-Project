import React from "react";

type props = {
  children: React.ReactNode;
  header: string;
  canCopy?: boolean;
};

export default function SecretsTab({ children, header, canCopy }: props) {
  return (
    <div className="rounded-xl my-2 select-none flex justify-between items-center w-full">
      {header}
      {children}
      {canCopy && (
        <button
          className="font-bold active:bg-gray-200 active:shadow-lg active:shadow-blue-300 border-4 border-blue-500 rounded-full px-2"
          onClick={() => {
            if (children)
              navigator.clipboard.writeText(children.toLocaleString());
          }}
        >
          Copy
        </button>
      )}
    </div>
  );
}
