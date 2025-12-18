"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

export default function Step2VC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState<any>({});

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasInvalid, setHasInvalid] = React.useState<boolean>(false);
  const [hasLoadingResendOTP, setHasLoadingResendOTP] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      return router.replace("/catfawn");
    }
    try {
      const result = JSON.parse(stored);
      setCachedData(result);
      if (result?.completedSteps !== undefined && result?.completedSteps < 1) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    setHasInvalid(false);

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    setHasInvalid(false);
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      createMessage("Please enter all 6 digits", "error");
      return;
    }

    try {
      setIsLoading(true);
      const result = await axios.post("/api/visitors/verify-otp", {
        email: cachedData.email,
        otp: code,
      });

      if (result.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "catfawn/step3",
            hasVerifiedEmail: true,
            completedSteps: 2,
          })
        );
        router.replace("/catfawn/step3");
      } else {
        setHasInvalid(true);
        setIsLoading(false);
        createMessage(
          result.data.message || "Invalid verification code.",
          "error"
        );
      }
    } catch (err) {
      setIsLoading(false);
      createMessage("Something went wrong. Try again.", "error");
    }
  };

  const resendOTP = async () => {
    setHasInvalid(false);
    setHasLoadingResendOTP(true);
    const result = await axios.post("/api/visitors/resend-otp", {
      email: cachedData.email,
      type: "email",
    });
    if (result.data.status) {
      setOtp(["", "", "", "", "", ""]);
      createMessage(result.data.message, "success");
    } else {
      createMessage(result.data.message, "error");
    }
    setHasLoadingResendOTP(false);
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

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    setHasInvalid(false);
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.split("").slice(0, 6);
    const updated = [...otp];

    digits.forEach((digit, i) => {
      if (index + i < 6) {
        updated[index + i] = digit;
      }
    });

    setOtp(updated);
    const nextPos = Math.min(index + digits.length - 1, 5);
    inputRefs.current[nextPos]?.focus();
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                localStorage.setItem(
                  "catfawn-data",
                  JSON.stringify({
                    ...cachedData,
                    currentStep: "catfawn",
                  })
                );
                router.replace("/catfawn");
              }}
            >
              <path
                d="M20 12L4 12M4 12L10 6M4 12L10 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Request Early Access
        </h2>
        <p className="max-sm:text-base font-avenirNext max-md:text-sm font-bold leading-[130%] mt-[0.313rem] -tracking-[0.06em]">
          Step 2 of 15: Check your email to confirm your early access request{" "}
          <span className="text-[#FFFFFFE5] font-normal font-avenir -tracking-[0.02em]">
            {" "}
            We’ve sent a 6-digit verification code to {cachedData.email}{" "}
          </span>
          <div className="mt-[0.563rem] text-[0.938rem] text-[#FFFFFFE5] leading-[105%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap -tracking-[0.02em]">
            <ul className="ml-6 list-disc">
              <li>Open your email</li>
              <li>Look for a message from security@kinshipbots.com</li>
              <li>Enter the code below to confirm it’s you</li>
            </ul>
          </div>
        </p>
        <form className="mt-[1.25rem] text-[1rem] max-md:text-sm font-normal">
          <div className="max-lg:text-center">
            <label className="block mb-[0.313rem] text-[1rem] leading-[100%] text-[#FFFFFFCC]">
              Enter your 6-digit code
            </label>
            <div className="flex gap-7 max-xl:gap-4 max-lg:justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={(e) => handlePaste(e, idx)}
                  className={`w-14 h-[3.438rem] max-lg:w-14 max-lg:h-[3.438rem] max-sm:w-8 max-sm:h-8 max-xl:h-6 p-5 rounded-lg backdrop-blur-[12.16px] border text-white focus:outline-none ${hasInvalid ? "bg-[#F8060624] border-[#F806068F]" : "bg-[#402A2A] border-[#FFFFFF29] focus:border-white"}`}
                />
              ))}
            </div>

            {!hasInvalid && (
              <span className="text-[0.75rem] inline-block text-[rgba(255,255,255,0.9)] opacity-70 leading-[140%] font-normal -tracking-[0.02em] mt-[0.313rem]">
                The code expires in 15 minutes. Didn’t get it? Check your spam
                folder or request a new code.
              </span>
            )}
            {hasInvalid && (
              <span className="text-[0.75rem] inline-block text-[rgba(255,255,255,0.9)] opacity-70 leading-[140%] font-normal -tracking-[0.02em] mt-[0.313rem]">
                That code doesn’t look right. Please check your email and try
                again.
              </span>
            )}

            <div className="text-center text-[0.875rem] text-[#FFFFFFE5] mt-[0.813rem] leading-[140%] font-normal -tracking-[0.02em]">
              Didn’t get a code?{" "}
              <span onClick={resendOTP} className="cursor-pointer underline">
                {hasLoadingResendOTP ? "Sending..." : " Resend code"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="steps_btn_submit mt-[5.438rem]"
            onClick={verifyOTP}
          >
            {isLoading && <Spinner size="sm" />} Confirm My Early Access{" "}
          </button>
        </form>
      </div>
    </>
  );
}
