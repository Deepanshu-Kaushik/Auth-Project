import React from "react";

type Props = {
  type: React.HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  children?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function CustomInput({
  type,
  name,
  placeholder,
  children,
  onChange,
}: Props) {
  return (
    <div className="border border-gray-400 rounded-sm p-3 md:p-4 w-full my-2 md:my-3 flex">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full outline-none md:placeholder:text-lg placeholder:select-none"
        onChange={onChange}
      />
      {children}
    </div>
  );
}
