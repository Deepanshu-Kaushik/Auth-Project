"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import RequiredSymbol from "./RequiredSymbol";
import Link from "next/link";
import SubmitButton from "./SubmitButton";

type props = {
  data?: {
    id: string;
    name: string;
    homepage_url: string;
    callback_url: string;
    description?: string;
    logo?: string;
    client_id: string;
    client_secret: string;
    scope: string;
  };
  path: string;
  url: string;
  method: string;
};

export default function InputAppData({ data, path, url, method }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    data !== undefined
      ? data
      : {
          name: "",
          logo: "",
          homepage_url: "",
          description: "",
          callback_url: "",
          scope: "",
        }
  );

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 200) {
        console.log("Form data submitted successfully");
        if (method === "PATCH") router.push("/dashboard");
        else if (method === "POST")
          router.push(`/display/${(await response.json()).appid}`);
      } else if (response.status === 401) {
        console.log("Failed to submit form data because userid not mentioned");
      } else if (response.status === 500) {
        console.log("Internal error");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="my-3">
        <label className="my-2">
          <h1 className="my-1">
            Application name <RequiredSymbol />
          </h1>
          <input
            type="text"
            name="name"
            className="outline-none border border-gray-400 rounded-sm px-4 py-2"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </label>

        <label className="my-2">
          <h1 className="my-1">App Logo</h1>
          <input
            className="max-w-64 cursor-pointer outline-none block text-sm text-slate-500 
            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm 
            file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-
            blue-100 file:hover:cursor-pointer"
            name="logo"
            type="file"
            accept="image/*"
            value={formData.logo}
            onChange={handleChange}
          />
        </label>

        <label className="my-2">
          <h1 className="my-1">
            Application URL
            <RequiredSymbol />
          </h1>
          <input
            type="url"
            name="homepage_url"
            className="outline-none border border-gray-400 rounded-sm px-4 py-2"
            onChange={handleChange}
            value={formData.homepage_url}
            required
          />
        </label>

        <label className="my-2">
          <h1 className="my-1">Application description</h1>
          <textarea
            name="description"
            className="outline-none border border-gray-400 rounded-sm px-4 py-2 min-w-full"
            onChange={handleChange}
            placeholder="Application description is optional"
            value={formData.description}
          />
        </label>

        <label className="my-2">
          <h1 className="my-1">
            Application callback URL
            <RequiredSymbol />
          </h1>
          <input
            type="url"
            name="callback_url"
            className="outline-none border border-gray-400 rounded-sm px-4 py-2"
            onChange={handleChange}
            value={formData.callback_url}
            required
          />
        </label>

        <label htmlFor="scope">
          <h1 className="my-2">
            Scope
            <RequiredSymbol />
          </h1>
          <select
            className="border border-black"
            id="scope"
            name="scope"
            onChange={handleChange}
            value={formData.scope}
            required
          >
            <option value="">-- Select --</option>
            <option key={"email"} value={"email"}>
              email
            </option>
            <option key={"all"} value={"all"}>
              all
            </option>
          </select>
        </label>

        <div className="border mt-6" />
        <SubmitButton className="rounded-none p-2" disabled={loading}>
          {loading && <span>Adding...</span>}
          {!loading && path === "new" ? (
            <span>Register application</span>
          ) : (
            !loading && path === "edit" && <span>Confirm edit</span>
          )}
        </SubmitButton>
        <Link
          href={"/dashboard"}
          className="mx-4 text-sm font-bold text-red-600"
        >
          Cancel
        </Link>
      </form>
    </main>
  );
}
