"use client";
import * as React from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useRouter } from "next/navigation";
import EyeLineIcon from "@/assets/icons/EyeLineIcon";
import EyeIcon from "@/assets/icons/EyeIcon";
import KinshipCodesLogin from "@/assets/icons/KinshipCodesLogin";
import client from "../lib/httpClient";
import { useAtom } from "jotai";
import { data, isAuth, isAuthOverlayOpen } from "../store";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const [_, setShowAuthOverlay] = useAtom(isAuthOverlayOpen);
  const [__, setIsUserAuthenticated] = useAtom(isAuth);
  const [___, setUser] = useAtom(data);

  const checkIfIsAuthenticated = React.useCallback(async () => {
    const result = await client.get("/is-auth");

    if (result.data) {
      router.replace("/");
      const user = result.data?.data?.user;

      setShowAuthOverlay(!user);
      setIsUserAuthenticated(!!user);
      setUser(user);
    }
  }, []);

  const submit = React.useCallback(
    async (e: any) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`;
        const res = await client.post(url, {
          handle: email,
          password,
        });

        window.localStorage.setItem("token", res.data.data.token);
        setIsUserAuthenticated(true);
        setShowAuthOverlay(false);
        setUser(res.data.data.user);
        router.replace("/coins");
      } catch (err: any) {
        setError(
          err?.response?.data || "Failed to Login, please check support",
        );
      }

      setIsLoading(false);
    },
    [email, password],
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

      <h6 className="my-4">Log In</h6>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex flex-col my-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          error={error === "user"}
          helperText={error === "user" ? "User does not exists" : ""}
          placeholder="Enter your email address..."
          title="Email address"
          required={false}
        />

        <div className="my-2" />

        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Enter your password..."
          title="Password"
          helperText={error === "password" ? "Incorrect password" : ""}
          error={error === "password"}
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
      </div>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex items-center justify-end">
        <a
          className="text-sm underline cursor-pointer"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </a>
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Log In"
          action={() => { }}
          size="large"
          isPrimary
          type="submit"
          isLoading={isLoading}
          disabled={!email || !password}
        />
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] my-2">
        <Button
          title="Create New Account"
          action={() => {
            router.push("/sign-up");
          }}
          size="large"
          isPrimary={false}
          isLoading={false}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-center w-[60%] md:w-[35%] lg:w-[20%] my-2">
        <a
          className="text-base underline"
          href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/coins`}
        >
          Skip this, just take me to the coins
        </a>
      </div>
    </form>
  );
};

export default Login;
