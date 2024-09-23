"use client";
import * as React from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import axios from "axios";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useRouter } from "next/navigation";
import { storeFormAtom } from "../store/signup";

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = useAtom(storeFormAtom);

  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const checkIfIsAuthenticated = React.useCallback(async () => {
    const result = await axios.get("/api/is-auth");

    if (result.data) {
      router.replace("/");
    }
  }, []);

  React.useEffect(() => {
    checkIfIsAuthenticated();
  }, [router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }
    setConfirmPasswordError(false);
    setIsLoading(true);

    try {
      await axios.post("/api/request-verification", {
        email: form.email,
      });
      router.push("/sign-up/code");
    } catch (_) {}
    setIsLoading(false);
  };

  return (
    <form
      className="w-full min-h-full flex flex-col items-center background-content pt-32 relative"
      onSubmit={submit}
    >
      <div className="flex flex-col items-center my-6">
        <div className="flex flex-col relative w-[250px] h-[100px] my-6">
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

      <h6 className="my-4">Sign Up</h6>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex flex-col my-4">
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          type="text"
          placeholder="First Name or Alias"
          title="First Name or Alias"
          required={false}
        />

        <div className="my-2" />

        <Input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="text"
          placeholder="Enter your email address..."
          title="Email address"
          required={false}
        />

        <div className="my-2" />

        <Input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          error={confirmPasswordError}
          placeholder="Enter your password..."
          title="Password"
          required={false}
        />

        <div className="my-2" />

        <Input
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          type="password"
          error={confirmPasswordError}
          helperText={confirmPasswordError ? "Passwords must match!" : ""}
          placeholder="Confirm your Password..."
          title="Confirm Password"
          required={false}
        />
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Sign Up"
          action={() => {}}
          size="large"
          type="submit"
          isPrimary
          isLoading={isLoading}
        />
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] my-2">
        <Button
          title="Have an Account?"
          action={() => {
            router.push("/login");
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

export default SignUp;
