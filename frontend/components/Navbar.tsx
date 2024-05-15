"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import profile from "@/assets/profile/temp-profile.png";
import menu from "@/assets/menu.png";

export default function Navbar() {
  const [hidden, setHidden] = useState(true);

  async function logout() {
    localStorage.removeItem('userid');
    try {
      const response = await fetch("http://localhost:5000/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 401) {
        console.log("logout failed");
      } else if (response.status === 500) {
        throw new Error("Internal error");
      }
    } catch (error) {
      console.error("Error submitting login form:", error);
    }
  }

  return (
    <>
      <div className="flex md:hidden">
        <Image
          src={menu}
          width={30}
          alt="menu"
          className="flex relative top-10 mx-5"
          onClick={() => setHidden(!hidden)}
        />

        <div>
          <div
            className={`min-h-screen fixed top-0 left-0 bg-white shadow-[0_0_30px_0px_rgba(0,0,0,0.6)] w-[40%] md:w-[20%] ${
              hidden ? "hidden" : "fixed z-0"
            }`}
          ></div>
          <div
            className={`bg-gray-50 bg-opacity-50 fixed top-0 right-0 min-h-screen w-[61%] md:w-[80%] ${
              hidden ? "hidden" : ""
            }`}
            onClick={() => setHidden(!hidden)}
          ></div>
        </div>
      </div>

      <main className="shadow-lg mb-10 h-24">
        <div
          className={`p-4 px-10 lg:px-20 md:w-full h-24 md:flex flex-col md:flex-row justify-between md:items-center ${
            hidden ? "hidden" : "absolute z-1"
          }`}
        >
          <Link
            href={"/dashboard"}
            className="select-none text-xl md:text-3xl"
            onClick={() => setHidden(true)}
          >
            Auth Project
          </Link>
          <div className="flex my-10 flex-col-reverse md:flex-row md:items-center gap-5">
            <div className="flex flex-col md:flex-row md:items-center">
              <Link
                href={"/dashboard/new"}
                className="hover:bg-black hover:text-white p-2 font-bold"
                onClick={() => setHidden(true)}
              >
                Create New App
              </Link>
              <Link
                href={"/login"}
                className="hover:bg-black hover:text-white p-2 font-bold"
                onClick={logout}
              >
                Logout
              </Link>
            </div>
            <Image src={profile} alt="User Profile" />
          </div>
        </div>
      </main>
    </>
  );
}
