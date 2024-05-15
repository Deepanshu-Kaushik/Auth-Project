"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isTokenValid, setIsTokenValid] = useState<boolean>();

  useEffect(() => {
    !(async function checkToken() {
      try {
        const response = await fetch("http://localhost:5000/auth/validtoken", {
          cache: "no-cache",
          method: "GET",
          credentials: "include",
        });
        if (response.status === 200) {
          const isTokenValid = (await response.json()).checktoken;
          setIsTokenValid(isTokenValid);
        } else if (response.status === 401) {
          console.log("Token validation failed");
        } else if (response.status === 500) {
          throw new Error("Internal error");
        }
      } catch (error) {
        console.error("Error in checking token validation:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    if (userid || isTokenValid) router.push("/dashboard");
    else router.push("/login");
  }, []);

  return <main>Redirecting...</main>;
}
