"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "./components/Spinner";

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
        password: result.password || "",
        confirmPassword: result.password || "",
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
    }

    if (!formData.email.trim()) {
      createMessage("Email is required", "error");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.com$/i.test(formData.email.trim())) {
      createMessage("Please enter a valid email", "error");
      return false;
    }

    if (!formData.password) {
      createMessage("Password is required", "error");
      return false;
    } else if (formData.password.length < 6) {
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
      createMessage("You must agree before submitting", "error");
      return false;
    }

    return true;
  };

  const createVisitorRecord = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (cachedData.email === formData.email && cachedData.hasVerifiedEmail) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            email: formData.email,
            firstName: formData.firstName,
            password: formData.password,
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
            email: formData.email,
            firstName: formData.firstName,
            password: formData.password,
            hasVerifiedEmail: false,
            completedSteps: 1,
          })
        );
        setIsLoading(false);
        router.replace("/catfawn/step2");
      } else {
        setIsLoading(false);
        createMessage(result.data.message || "Something went wrong", "error");
      }
    } catch (err: any) {
      setIsLoading(false);
      createMessage(
        err?.response?.data?.message ||
          "Unable to generate OTP. Please try again.",
        "error"
      );
    }
  };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 4000);
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
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

        <form className="mt-[0.625rem] text-[1rem] max-md:text-sm font-normal">
          <div className="flex flex-col gap-[0.313rem]">
            <div>
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                First Name*
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                value={formData.firstName}
                onChange={(event) =>
                  setFormData({ ...formData, firstName: event.target.value })
                }
              />
            </div>

            <div className="mt-[0.313rem]">
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                Email address*
              </label>
              <input
                type="email"
                placeholder="Email address"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
            </div>

            <div className="mt-[0.313rem]">
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                Password*
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
              />
            </div>

            <div className="mt-[0.313rem]">
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                Confirm Password*
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    confirmPassword: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="steps_btn_submit mt-[1.688rem]"
            onClick={createVisitorRecord}
          >
            {isLoading && <Spinner size="sm" />} Join Early Access
          </button>

          <label className="w-[110%] flex items-start gap-0.5  mt-1">
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

          <p
            className="text-center text-[0.813rem] text-white font-normal leading-[100%] underline cursor-pointer mt-[0.313rem] tracking-normal"
            onClick={() => window.open("https://catfawn.com/privacy-policy/")}
          >
            Privacy Policy
          </p>
        </form>
      </div>
    </>
  );
}
