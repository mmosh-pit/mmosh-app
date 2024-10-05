"use client";
import * as React from "react";
import Image from "next/image";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
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
      setIsLoading(true);
      try {
        await axios.post("/api/login", {
          email,
          password,
        });
        router.replace("/");
      } catch (_) {}

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

      <h6 className="my-4">Log In</h6>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex flex-col my-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter your email address..."
          title="Email address"
          required={false}
        />

        <div className="my-2" />

        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password..."
          title="Password"
          required={false}
        />
      </div>

      <div className="w-[75%] md:w-[40%] lg:w-[25%] flex items-center justify-end">
        <a
          className="text-sm underline"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </a>
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Log In"
          action={() => {}}
          size="large"
          isPrimary
          type="submit"
          isLoading={isLoading}
          disabled={!email || !password}
        />
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] my-2">
        <Button
          title="Create new Account"
          action={() => {
            router.push("/sign-up");
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

export default Login;
