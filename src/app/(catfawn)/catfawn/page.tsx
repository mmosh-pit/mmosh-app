"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "./components/Spinner";
import { encryptData, decryptData } from "@/utils/decryptData";
import { InputVW } from "./components/Input/InputVW";
import { ErrorContainerVW } from "./components/ErrorContainer/ErrorContainerVW";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hasChecked: false,
  });
  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [cachedData, setCachedData] = React.useState<any>({});

  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("catfawn-data");
      if (!stored) return;

      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep && result?.currentStep !== "catfawn") {
        return router.replace(`/${result.currentStep}`);
      }
      setFormData({
        firstName: result.firstName || "",
        email: result.email || "",
        password: decryptData(result.password || ""),
        confirmPassword: decryptData(result.password || ""),
        hasChecked: true,
      });
    } catch {
      localStorage.removeItem("catfawn-data");
    }
  }, []);

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      createMessage("First name is required", "error");
      return false;
    } else if (formData.firstName.trim().length < 2) {
      createMessage("First name must be at least 2 characters", "error");
      return false;
    } else if (formData.firstName.trim().length > 16) {
      createMessage("First name can be up to 16 characters only", "error");
      return false;
    }

    if (!formData.email.trim()) {
      createMessage("Email is required", "error");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(formData.email.trim())) {
      createMessage("Please enter a valid email", "error");
      return false;
    }

    if (!formData.password) {
      createMessage("Password is required", "error");
      return false;
    } else if (/\p{Extended_Pictographic}/u.test(formData.password)) {
      createMessage("Password should not contain emojis", "error");
      return false;
    }

    else if (formData.password.length < 6) {
      createMessage("Password must be at least 6 characters", "error");
      return false;
    } else if (formData.password.length > 32) {
      createMessage("Password must not exceed 32 characters", "error");
      return false;
    }

    if (!formData.confirmPassword) {
      createMessage("Confirm password is required.", "error");
      return false;
    } else if (formData.password !== formData.confirmPassword) {
      createMessage("The password and confirm password do not match.", "error");
      return false;
    }

    if (!formData.hasChecked) {
      createMessage(
        "You must agree to receive communications before submitting",
        "error"
      );
      return false;
    }

    return true;
  };

  const createVisitorRecord = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (cachedData.email === formData.email && cachedData.hasVerifiedEmail) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            email: formData.email.trim(),
            firstName: formData.firstName,
            password: encryptData(formData.password),
            currentStep: "catfawn/step3",
          })
        );
        return router.replace("/catfawn/step3");
      }

      const result = await axios.post("/api/visitors/generate-otp", {
        type: "email",
        email: formData.email,
      });

      if (result.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            currentStep: "catfawn/step2",
            email: formData.email.trim(),
            firstName: formData.firstName,
            password: encryptData(formData.password),
            hasVerifiedEmail: false,
            completedSteps: 1,
          })
        );
        router.replace("/catfawn/step2");
      } else {
        createMessage(result.data.message || "Something went wrong", "error");
      }
    } catch (err: any) {
      createMessage(
        err?.response?.data?.message ||
        "Unable to generate OTP. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };


  const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo(0, 0);

    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);

    if (msgTimeoutRef.current) {
      clearTimeout(msgTimeoutRef.current);
    }

    msgTimeoutRef.current = setTimeout(() => {
      setShowMsg(false);
      msgTimeoutRef.current = null;
    }, 4000);
  };


  return (
    <>
      <ErrorContainerVW
        showMessage={showMsg}
        className={msgClass}
        messageText={msgText}
      />
      <div className="min-h-135.5 xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] ps-[3.25em] pe-[3.063em] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>

        <p className="text-[1rem] font-avenirNext max-md:text-sm font-bold leading-[130%] mt-[0.313rem]">
          Step 1 of 15: Enter your name and email address.{" "}
          <span className="text-[#FFFFFFE5] font-normal font-avenir">
            {" "}
            We’ll send a link to verify it’s really you.
          </span>
        </p>

        <form
          className="mt-[0.625rem] text-[1rem] max-md:text-sm font-normal"
          onSubmit={(e) => createVisitorRecord(e)}
        >
          <div className="flex flex-col gap-[0.313rem]">
            <InputVW
              labelText="First Name"
              value={formData.firstName}
              placeHolder="First Name"
              inputType="text"
              isRequired={true}
              onChange={(event) =>
                setFormData({ ...formData, firstName: event.target.value })
              }
            />
            <InputVW
              labelText="Email address"
              value={formData.email}
              placeHolder="Email address"
              inputType="email"
              isRequired={true}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
            <InputVW
              labelText="Password"
              value={formData.password}
              placeHolder="Password"
              inputType="password"
              isRequired={true}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
            <InputVW
              labelText="Confirm Password"
              value={formData.confirmPassword}
              placeHolder="Confirm Password"
              inputType="password"
              isRequired={true}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  confirmPassword: event.target.value,
                })
              }
            />
          </div>

          <button type="submit" className="steps_btn_submit mt-[1.688rem]">
            {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
          </button>

          <label className="xl:w-[110%] flex items-start gap-0.5 mt-1 w-auto">
            <input
              type="checkbox"
              className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem] me-0.5"
              checked={formData.hasChecked}
              onChange={(event) =>
                setFormData({ ...formData, hasChecked: event.target.checked })
              }
            />
            <span className="text-[#FFFFFFE5] text-[0.813rem] font-normal max-md:text-xs leading-[140%] -tracking-[0.02em]">
              I agree to receive communications about the CAT-FAWN Connection
              early access program and launch updates.
            </span>
          </label>

          <div className="text-center">
            <span
              className="text-center text-[0.813rem] text-white font-normal leading-[100%] underline cursor-pointer mt-[0.313rem] tracking-normal"
              onClick={() => window.open("https://catfawn.com/privacy-policy/")}
            >
              Privacy Policy
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
