"use client";

import AuthTitle from "@/components/AuthTitle";
import Card from "@/components/Card";
import CreatePasswordField from "@/components/CreatePasswordField";
import CustomInput from "@/components/CustomInput";
import ErrorComponent from "@/components/ErrorComponent";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const schema = z
  .object({
    firstname: z
      .string()
      .min(3, { message: "First name should be minimum of length 3." })
      .max(20, { message: "First name should be maximum of length 20." }),
    lastname: z
      .string()
      .min(3, { message: "Last name should be minimum of length 3." })
      .max(20, { message: "Last name should be maximum of length 20." }),
    email: z.string().email({ message: "Invalid email." }),
    password: z
      .string()
      .min(8, { message: "Password should be minimum of length 8." })
      .max(20, { message: "Password should be maximum of length 20." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password should be minimum of length 8." })
      .max(20, { message: "Password should be maximum of length 20." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<{
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    userExists?: string;
    internalError?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedUser = schema.safeParse(formData);
    if (!parsedUser.success) {
      const error = parsedUser.error;
      let newErrors = {};
      for (const issue of error.issues) {
        newErrors = {
          ...newErrors,
          [issue.path[0]]: issue.message,
        };
      }
      return setFormErrors(newErrors);
    }

    setLoading(true);
    try {
      const userData = {
        name: formData.firstname + " " + formData.lastname,
        email: formData.email,
        password: formData.password,
      };
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });
      if (response.status === 200) {
        console.log("Signup successfull");
        router.push("/login");
      } else if (response.status === 401) {
        console.log("User already exists");
        setFormErrors({
          userExists: "User already exists.",
        });
        setLoading(false);
      } else if (response.status === 500) {
        setFormErrors({
          internalError: "Internal error.",
        });
        throw new Error("Internal error");
      }
    } catch (error) {
      console.error("Error submitting signup form:", error);
    }
  };

  return (
    <>
      {formErrors.internalError ? (
        <div className="min-h-screen flex justify-center items-center">
          <ErrorComponent className="text-5xl">Internal error !</ErrorComponent>
        </div>
      ) : (
        <main className="min-h-screen flex flex-col justify-center items-center">
          <Card className="mx-5">
            <AuthTitle>Sign Up</AuthTitle>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <CustomInput
                type="text"
                name="firstname"
                placeholder="First name"
                onChange={handleChange}
              />
              {formErrors.firstname && (
                <ErrorComponent>{formErrors.firstname}</ErrorComponent>
              )}
              <CustomInput
                type="text"
                name="lastname"
                placeholder="Last name"
                onChange={handleChange}
              />
              {formErrors.lastname && (
                <ErrorComponent>{formErrors.lastname}</ErrorComponent>
              )}
              <CustomInput
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
              {formErrors.email && (
                <ErrorComponent>{formErrors.email}</ErrorComponent>
              )}

              <CreatePasswordField
                placeholder={["Create password", "Confirm password"]}
                onChange={handleChange}
                formErrors={formErrors}
              />

              {formErrors.userExists && (
                <ErrorComponent className="mb-5">
                  {formErrors.userExists}
                </ErrorComponent>
              )}

              <SubmitButton>
                {loading && <span>Loading...</span>}
                {!loading && <span>Sign Up</span>}
              </SubmitButton>
            </form>
          </Card>
          <h1>
            Already have an account?
            <Link href={"/login"} className="text-sky-600 font-bold mx-1">
              Login
            </Link>
          </h1>
        </main>
      )}
    </>
  );
}
