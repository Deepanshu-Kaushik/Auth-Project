import React from "react";
import SecretsTab from "./SecretsTab";

type Props = {
  canCopy: boolean[];
  secrets: string[];
};

export default function SecretsComponent({ canCopy, secrets }: Props) {
  return (
    <div>
      <div className="flex flex-col justify-between items-center">
        <SecretsTab canCopy={canCopy[0]} header={"Client ID: "}>
          {secrets[0]}
        </SecretsTab>
        <SecretsTab canCopy={canCopy[1]} header={"Client Secret: "}>
          {secrets[1]}
        </SecretsTab>
      </div>
    </div>
  );
}
