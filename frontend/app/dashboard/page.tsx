"use client";

import Image from "next/image";
import appLogo from "@/assets/logo/app-logo.png";
import Link from "next/link";
import AuthTitle from "@/components/AuthTitle";
import { getDashboardData } from "@/utils/getDashboardData";
import { useEffect, useState } from "react";
import ErrorComponent from "@/components/ErrorComponent";
import getLoggedInApps from "@/utils/getLoggedInApps";
import { useRouter } from "next/navigation";

type DashboardData = {
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

type LoggedInData = {
  id: string;
  app: {
    client_id: string;
    callback_url: string;
    scope: string;
    id: string;
    name: string;
    homepage_url: string;
  };
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData[]>();
  const [loggedInApps, setLoggedInApps] = useState<LoggedInData[]>();
  const [userid, setUserid] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const userid = localStorage.getItem("userid");
      if (userid) {
        setUserid(userid);
        const dashboardData = await getDashboardData(userid);
        setDashboardData(dashboardData);
        const loggedInApps = await getLoggedInApps(userid);
        setLoggedInApps(loggedInApps);
      }
    })();
  }, []);

  async function handleAuth(
    client_id: string,
    callback_url: string,
    scope: string
  ) {
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
      <main className="min-h-screen space-y-4 px-12">
        <div className="min-h-[50vh]">
          <AuthTitle>User apps</AuthTitle>
          {userid && dashboardData !== undefined && dashboardData.length > 0 ? (
            <div className="flex gap-10 flex-wrap">
              {dashboardData.map((element) => (
                <Link key={element.id} href={`/dashboard/${element.id}`}>
                  <div
                    className={`rounded-md shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)] p-4 my-3 flex flex-col items-center gap-0`}
                  >
                    <Image
                      src={appLogo}
                      alt="App logo"
                      width={96}
                      height={96}
                      priority
                    />
                    <h1>{element.name}</h1>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <ErrorComponent>User logged out!</ErrorComponent>
          )}
        </div>
        <div className="min-h-auto">
          <AuthTitle>Logged in apps</AuthTitle>
          {userid && loggedInApps !== undefined && loggedInApps.length > 0 ? (
            <div className="flex gap-10 flex-wrap">
              {loggedInApps.map((element) => (
                <button
                  key={element.id}
                  onClick={() =>
                    handleAuth(
                      element.app.client_id,
                      element.app.callback_url,
                      element.app.scope
                    )
                  }
                >
                  <div
                    className={`rounded-md shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)] p-4 my-3 flex flex-col items-center gap-0`}
                  >
                    <Image
                      src={appLogo}
                      alt="App logo"
                      width={96}
                      height={96}
                      priority
                    />
                    <h1>{element.app.name}</h1>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <ErrorComponent>User logged out!</ErrorComponent>
          )}
        </div>
      </main>
    </>
  );
}
