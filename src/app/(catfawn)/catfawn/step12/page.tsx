// step4b
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";
// import toast from "react-hot-toast";

export default function Step12VC() {
  const router = useRouter();

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) return router.replace("/");

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result.currentStep !== "catfawn/step12") {
        router.replace("/" + result.currentStep);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasteData) return;

    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (index + i < 6) {
        newOtp[index + i] = char;
      }
    });

    setOtp(newOtp);

    const nextIndex = Math.min(index + pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };


  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOTP = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      createMessage("Please enter the full 6-digit code.", "error");
      return;
    }

    try {
      setIsLoading(true)
      const res = await axios.post("/api/visitors/verify-email", {
        email: cachedData.email,
        otp: enteredOtp,
        currentStep: "catfawn/step13",
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "catfawn/step13",
          })
        );

        router.replace("/catfawn/step13");
      } else {
        createMessage(res.data.message || "Invalid OTP", "error");
      }
    } catch {
      createMessage("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    const result = await axios.post("/api/visitors/resend-otp", {
      email: cachedData.email,
      type: "sms",
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      }
    });
    if (result.data.status) {
      createMessage(result.data.message, "success");
    } else {
      createMessage(result.data.message, "error");
    }
  };

  const createMessage = (message: string, type: "success" | "error") => {
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.25rem] px-[3.125rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div className="absolute left-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.04em]">
          Step 12 of 14: Let’s Confirm Your Mobile Number.{" "}
          <span className="font-normal font-avenir">
            {" "}
            We just sent you a one-time verification code by text message, along
            with a personal message from CAT FAWN. Enter the code below so we can
            reach you during early access.
          </span>
        </p>

        <form className="mt-[1.188rem] text-[1rem] max-md:text-sm font-normal">
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
                  className={`w-14 h-[3.438rem] max-lg:w-14 max-lg:h-[3.438rem] max-sm:w-8 max-sm:h-8 max-xl:h-6 p-5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none focus:bg-[#F8060624] focus:border-[#F806068F] ${digit
                      ? "bg-[#F8060624] border-[#F806068F]" // When filled
                      : "bg-[#402A2A] border-[#FFFFFF29]"
                    }`}
                />
              ))}
            </div>

            <div className="text-[1rem] leading-[100%] font-normal text-[#FFFFFFCC] flex items-center justify-between mt-[0.313rem]">
              <p>Valid for 10 minutes.</p>
              <p>
                Need a new code?{" "}
                <span className="underline cursor-pointer" onClick={resendOTP}>
                  Resend
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-[10.875rem] flex justify-center items-center gap-2 font-avenirNext h-[3.125rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
            onClick={submitOTP}
          >
            {isLoading && <Spinner size="sm" />}
            Join Early Access
          </button>
        </form>
      </div>
    </>
  );
}
