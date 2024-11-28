"use client";

import KinshipCodesLogin from "@/assets/icons/KinshipCodesLogin";
import * as React from "react";
import Input from "./components/common/Input";
import Button from "./components/common/Button";
import axios from "axios";

export default function Home() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const submit = async () => {
    setIsLoading(true);

    await axios.post("/api/save-waitlist", {
      name,
      email,
    });

    setIsLoading(false);

    window.location.href = "https://www.kinship.systems";
  };

  return (
    <form
      className="background-content flex flex-col w-full h-full items-center pt-24"
      onSubmit={(e) => {
        e.preventDefault();

        submit();
      }}
    >
      <div className="flex flex-col items-center my-6">
        <div className="flex justify-center w-[250px] h-[100px] ">
          <KinshipCodesLogin />
        </div>
      </div>

      <div className="flex flex-col my-4">
        <h3 className="text-white font-bold text-xl text-center">
          Coming Soon
        </h3>

        <p className="mt-4 text-white text-base text-center">
          We're still building. We'll let you know when we're ready for you
        </p>
      </div>

      <div className="md:w-[50%] lg:w-[40%] xl:w-[30%] w-[80%] my-2 flex flex-col">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={false}
          type="text"
          title="First Name or Alias"
          placeholder="First Name or Alias"
        />

        <div className="h-4" />

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={false}
          type="text"
          title="Email address"
          placeholder="Email address"
        />
      </div>

      <div className="h-6" />

      <div className="md:w-[50%] lg:w-[40%] xl:w-[30%] w-[80%]">
        <Button
          title="Get Notified"
          size="large"
          action={() => {}}
          type="submit"
          isLoading={isLoading}
          isPrimary
        />
      </div>
    </form>
  );
}
