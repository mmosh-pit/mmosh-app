"use client";
import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useRouter } from "next/navigation";
import { storeFormAtom } from "../store/signup";
import EyeLineIcon from "@/assets/icons/EyeLineIcon";
import EyeIcon from "@/assets/icons/EyeIcon";
import KinshipCodesLogin from "@/assets/icons/KinshipCodesLogin";

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = useAtom(storeFormAtom);

  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    React.useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

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

    if (!validateEmail(form.email)) {
      setEmailError(true);
    }

    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }
    setEmailError(false);
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
      className="w-full min-h-full flex flex-col items-center background-content py-6 relative"
      onSubmit={submit}
    >
      <div className="flex flex-col items-center my-6">
        <div className="flex justify-center w-[250px] h-[100px]">
          <KinshipCodesLogin />
        </div>
        <p className="text-base mt-4">It's All Related</p>
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
          error={emailError}
          helperText={emailError ? "Invalid Email Address" : ""}
          required={false}
        />

        <div className="my-2" />

        <Input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={confirmPasswordError}
          placeholder="Enter your password..."
          title="Password"
          type={isPasswordVisible ? "text" : "password"}
          required={false}
          trailing={
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              {isPasswordVisible ? <EyeLineIcon /> : <EyeIcon />}
            </button>
          }
        />

        <div className="my-2" />

        <Input
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          type={isConfirmPasswordVisible ? "text" : "password"}
          error={confirmPasswordError}
          helperText={confirmPasswordError ? "Passwords must match!" : ""}
          placeholder="Confirm your Password..."
          title="Confirm Password"
          required={false}
          trailing={
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
              }}
            >
              {isConfirmPasswordVisible ? <EyeLineIcon /> : <EyeIcon />}
            </button>
          }
        />
      </div>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex items-center">
        <input
          id="my-drawer"
          type="checkbox"
          className="checkbox mr-2 checked:border-[#645EBE] [--chkbg:theme(#645EBE)]"
          checked={acceptedTerms}
          onChange={(e) => {
            setAcceptedTerms(e.target.checked);
          }}
        />

        <a
          className="text-sm underline"
          href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/tos`}
          target="_blank"
        >
          Agree to Terms
        </a>
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Sign Up"
          action={() => {}}
          size="large"
          type="submit"
          isPrimary
          isLoading={isLoading}
          disabled={
            !form.name || !form.email || !form.password || !form.confirmPassword
          }
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
