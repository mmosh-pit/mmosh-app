"use client";
import * as React from "react";
import Image from "next/image";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const search = searchParams.get("code");

  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const checkIfIsAuthenticated = React.useCallback(async () => {
    const result = await axios.get("/api/is-auth");

    if (result.data) {
      router.replace("/");
    }
  }, []);

  const submit = React.useCallback(
    async (e: any) => {
      e.preventDefault();

      if (passwordConfirmation !== password) return;

      setIsLoading(true);
      try {
        await axios.post("/api/reset-password", {
          password,
          code: search,
        });
        router.replace("/login");
      } catch (_) {}

      setIsLoading(false);
    },
    [passwordConfirmation, password],
  );

  React.useEffect(() => {
    checkIfIsAuthenticated();
  }, [router]);

  if (!search) {
    router.replace("/login");
  }

  return (
    <form
      className="w-full min-h-full flex flex-col items-center background-content relative pt-32"
      onSubmit={submit}
    >
      <div className="flex flex-col items-center my-6">
        <div className="relative w-[250px] h-[100px] ">
          <Image
            src="https://storage.googleapis.com/mmosh-assets/logo_white.png"
            alt="mmosh"
            layout="fill"
          />
        </div>
        <p className="text-base mt-4">
          Intimate Conversations, Close-knit Communities
        </p>
      </div>

      <h6 className="my-4">Reset your Password</h6>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex flex-col my-4">
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your new password..."
          title="New Password"
          required={false}
        />

        <div className="my-2" />

        <Input
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          type="password"
          placeholder="Confirm your Password"
          title="Confirm your Password"
          required={false}
        />
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Reset your Password"
          action={() => {}}
          size="large"
          isPrimary
          type="submit"
          isLoading={isLoading}
          disabled={
            !passwordConfirmation ||
            !password ||
            passwordConfirmation !== password
          }
        />
      </div>
    </form>
  );
};

export default ResetPassword;