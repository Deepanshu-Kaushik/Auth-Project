"use client";

import AuthTitle from "@/components/AuthTitle";
import Card from "@/components/Card";
import CustomInput from "@/components/CustomInput";
import ErrorComponent from "@/components/ErrorComponent";
import PasswordField from "@/components/PasswordField";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z
    .string()
    .min(8, { message: "Password should be minimum of length 8." })
    .max(20, { message: "Password should be maximum of length 20." }),
});

export default function LoginPage() {
  const router = useRouter();
  const [userid, setUserid] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    wrongPassword?: string;
    internalError?: string;
  }>({});

  const [redirect,setRedirect] = useState<string>("");

  useEffect(()=> {
    const redirect = window.location.href.split("redirect=")[1]
    setRedirect(redirect)
  },[])

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
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("userid", data.userid);
        setUserid(data.userid);
        if (redirect) router.push(redirect);
        else router.push("/dashboard");
      } else if (response.status === 401) {
        console.log("Either email or password is incorrect.");
        setFormErrors({
          wrongPassword: "Either email or password is incorrect.",
        });
        setLoading(false);
      } else if (response.status === 500) {
        setFormErrors({
          internalError: "Internal error.",
        });
        throw new Error("Internal error");
      }
    } catch (error) {
      console.error("Error submitting login form:", error);
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
          <Card>
            <AuthTitle>Login</AuthTitle>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <CustomInput
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
              {formErrors.email && (
                <ErrorComponent>{formErrors.email}</ErrorComponent>
              )}
              <PasswordField placeholder="Password" onChange={handleChange} />
              {formErrors.password && (
                <ErrorComponent className="mb-5">
                  {formErrors.password}
                </ErrorComponent>
              )}
              {formErrors.wrongPassword && (
                <ErrorComponent className="mb-5">
                  {formErrors.wrongPassword}
                </ErrorComponent>
              )}
              <Link href={"#"} className="text-sky-600 font-semibold text-sm">
                Forgot Password?
              </Link>
              <SubmitButton>
                {loading && <span>Loading...</span>}
                {!loading && <span>Login</span>}
              </SubmitButton>
            </form>
          </Card>
          <h1>
            Don't have an account?
            <Link href={"/signup"} className="text-sky-600 font-bold mx-1">
              Sign Up
            </Link>
          </h1>
        </main>
      )}
    </>
  );
}
