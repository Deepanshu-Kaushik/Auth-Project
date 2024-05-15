"use client";
import React, { useState } from "react";
import CustomInput from "./CustomInput";

type Props = {
  placeholder: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function PasswordField({ placeholder, onChange }: Props) {
  const [showHide, setShowHide] = useState("show");
  const [type, setType] = useState("password");

  function buttonClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setShowHide((prev) => (prev === "show" ? "hide" : "show"));
    setType((prev) => (prev === "password" ? "text" : "password"));
  }

  return (
    <>
      <CustomInput type={type} name="password" placeholder={placeholder} onChange={onChange}>
        <button
          className="text-sky-600 font-semibold"
          onClick={(e) => buttonClicked(e)}
        >
          {showHide}
        </button>
      </CustomInput>
    </>
  );
}
