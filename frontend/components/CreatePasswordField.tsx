"use client";
import React, { useState } from "react";
import CustomInput from "./CustomInput";
import ErrorComponent from "./ErrorComponent";

type Props = {
  placeholder: string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  formErrors: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export default function CreatePasswordField({
  placeholder,
  onChange,
  formErrors,
}: Props) {
  const [showHide, setShowHide] = useState("show");
  const [type, setType] = useState("password");

  function buttonClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setShowHide((prev) => (prev === "show" ? "hide" : "show"));
    setType((prev) => (prev === "password" ? "text" : "password"));
  }

  return (
    <>
      <CustomInput
        type={type}
        name="password"
        placeholder={placeholder[0]}
        onChange={onChange}
      />
      {formErrors.password && (
        <ErrorComponent>{formErrors.password}</ErrorComponent>
      )}
      <CustomInput
        type={type}
        name="confirmPassword"
        placeholder={placeholder[1]}
        onChange={onChange}
      >
        <button
          className="text-sky-600 font-semibold"
          onClick={(e) => buttonClicked(e)}
        >
          {showHide}
        </button>
      </CustomInput>
      {formErrors.confirmPassword && (
        <ErrorComponent>{formErrors.confirmPassword}</ErrorComponent>
      )}
    </>
  );
}
