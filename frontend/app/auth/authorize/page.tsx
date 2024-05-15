"use client";

import Card from "@/components/Card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import profile from "@/assets/profile/temp-profile.png";
import connecion from "@/assets/connection.png";
import logo from "@/assets/logo/project-logo.png";
import SubmitButton from "@/components/SubmitButton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState<boolean>();
  const searchParams = useSearchParams();
  const client_id = searchParams.get("client_id");
  const callback_url = searchParams.get("callback_url");
  const [userid, setUserid] = useState<Number>();
  const scope = searchParams.get("scope");

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    !(async function checkUser() {
      try {
        const response = await fetch("http://localhost:5000/auth/validuser", {
          cache: "no-cache",
          method: "GET",
          credentials: "include",
        });
        if (response.status === 200) {
          const isUserValid = (await response.json()).user;
          setIsUserValid(isUserValid);
        } else if (response.status === 401) {
          console.log("User validation failed");
        } else if (response.status === 500) {
          throw new Error("Internal error");
        }
      } catch (error) {
        console.error("Error in checking user validation:", error);
      }
    })();
  }, []);

  type authDataType = {
    userName: string;
    appName: string;
    redirectUrl: string;
  };

  const [authData, setAuthData] = useState<authDataType>();

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    if (userid) {
      setUserid(Number(userid));

      !(async function () {
        try {
          const response = await fetch(
            `http://localhost:5000/auth/authpage?userid=${userid}&clientid=${client_id}`,
            {
              cache: "no-cache",
              method: "GET",
              credentials: "include",
            }
          );
          if (response.status === 200) {
            const authData = await response.json();
            setAuthData(authData);
          } else if (response.status === 401) {
            console.log("Auth data fetch unsuccessfull");
          } else if (response.status === 500) {
            throw new Error("Internal error");
          }
        } catch (error) {
          console.error("Error in fetching auth data:", error);
        }
      })();
    } else router.push(`/login/?redirect=${window.location.href}`);
  }, []);

  async function handleSumbit() {
    try {
      const response = await fetch("http://localhost:5000/auth/authorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: client_id,
          callback_url: callback_url,
          scope: scope,
          userid: userid,
        }),
        credentials: "include",
      });
      if (response.status === 200) {
        const code = (await response.json()).code;
        console.log("Auth successfull");
        router.push(callback_url + `/${code}`);
      } else if (response.status === 401) {
        console.log("Auth unsuccessfull");
      } else if (response.status === 500) {
        throw new Error("Internal error");
      }
    } catch (error) {
      console.error("Error in authorizing:", error);
    }
  }

  return (
    <>
      {authData !== undefined ? (
        <main className="min-h-screen flex flex-col justify-center items-center gap-5">
          <div className="flex">
            <Image src={profile} className="object-contain" alt="profile" />
            <Image src={connecion} className="object-contain" alt="connecion" />
            <Image src={logo} className="object-contain" alt="logo" />
          </div>
          <h1 className="text-3xl">Authorize {authData.appName}</h1>
          <Card className="md:w-[600px] space-y-10">
            <div className="flex items-center gap-5">
              <Image src={profile} className="object-contain" alt="profile" />
              <div>
                <h3>
                  {authData.appName} by {authData.userName}
                </h3>
                <h5 className="text-sm text-slate-500">
                  wants to access your account
                </h5>
              </div>
            </div>
            <SubmitButton className="rounded-md w-full" onClick={handleSumbit}>
              Authorize {authData.userName}
            </SubmitButton>
            <div className="w-full text-center">
              <h5>Authorizing will redirect to</h5>
              <span className="text-sky-900 select-none">
                {authData.redirectUrl}
              </span>
            </div>
          </Card>
        </main>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
