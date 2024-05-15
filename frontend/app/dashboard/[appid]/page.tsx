"use client";

import InputAppData from "@/components/InputAppData";
import SecretsComponent from "@/components/SecretsComponent";
import { getEditData } from "@/utils/getEditData";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type data = {
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

export default function EditPage() {
  const [data, setData] = useState<data | undefined | 401 | 500>();
  const path = useParams<{ appid: string }>();
  useEffect(() => {
    (async function getData() {
      const data = await getEditData(path.appid);
      setData(data);
    })();
  }, [path.appid]);

  return (
    <main className="p-10 w-[80%] lg:w-[40%] m-auto">
      <div>
        {(() => {
          if (data === undefined) {
            return <h1>Loading!</h1>;
          } else if (data === 401) {
            return <h1>Invalid! User does not exist</h1>;
          } else if (data === 500) {
            return <h1>Internal Error!</h1>;
          } else {
            return (
              <div>
                <h1 className="text-3xl mb-2">Edit application: {data.name}</h1>
                <div className="border" />
                <SecretsComponent
                  canCopy={[true, false]}
                  secrets={[data.client_id, data.client_secret]}
                />
                <InputAppData
                  data={data}
                  path="edit"
                  url={`http://localhost:5000/application/edit?appid=${path.appid}`}
                  method="PATCH"
                />
              </div>
            );
          }
        })()}
      </div>
    </main>
  );
}
