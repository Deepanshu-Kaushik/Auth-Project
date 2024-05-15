'use client'

import InputAppData from "@/components/InputAppData";
import React, { useEffect, useState } from "react";

export default function CreateApp() {
  const[userid, setUserid] = useState<string>("");
  useEffect(()=> {
    const userid= localStorage.getItem('userid');
    if(userid) setUserid(userid);
  },[])
  return (
    <main className="p-10 w-[80%] lg:w-[40%] m-auto">
      <div className="">
        <h1 className="text-3xl mb-2">Register a new OAuth application</h1>
        <div className="border" />
        <InputAppData method="POST" url={`http://localhost:5000/application/create?userid=${userid}`} path="new" />
      </div>
    </main>
  );
}
