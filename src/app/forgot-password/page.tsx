"use client";
import * as React from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import KinshipCodesLogin from "@/assets/icons/KinshipCodesLogin";
import client from "../lib/httpClient";

const ForgotPassword = () => {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [success, setSuccess] = React.useState(false);

  const checkIfIsAuthenticated = React.useCallback(async () => {
    const result = await client.get("/is-auth");

    if (result.data) {
      router.replace("/");
    }
  }, []);

  const submit = React.useCallback(
    async (e: any) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await axios.post("/api/forgot-password-verification", {
          email,
        });
        setSuccess(true);
      } catch (_) { }

      setIsLoading(false);
    },
    [email],
  );

  React.useEffect(() => {
    checkIfIsAuthenticated();
  }, [router]);

  return (
    <form
      className="w-full min-h-full flex flex-col items-center background-content relative pt-32"
      onSubmit={submit}
    >
      <div className="flex flex-col items-center my-6">
        <div className="flex justify-center w-[250px] h-[100px] ">
          <KinshipCodesLogin />
        </div>
        <p className="text-base mt-4">It's All Related</p>
      </div>

      <h6 className="my-4">Reset your Password</h6>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex flex-col my-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter your email address..."
          title="Email address"
          required={false}
        />

        {success && (
          <p className="text-sm text-white">
            We sent you a link to the entered email address, please check your
            inbox! Make sure to check the Spam folder
          </p>
        )}
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Reset your Password!"
          action={() => { }}
          size="large"
          isPrimary
          type="submit"
          isLoading={isLoading}
          disabled={!email}
        />
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] my-2">
        <Button
          title="Go Back"
          action={() => {
            router.replace("/login");
          }}
          size="large"
          isPrimary={false}
          isLoading={false}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default ForgotPassword;
