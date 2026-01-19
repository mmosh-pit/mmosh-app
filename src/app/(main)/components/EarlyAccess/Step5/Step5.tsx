"use client";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Step5Props {
  onSuccess?: () => void;
  onBack?: () => void;
  setShowMsg: (data: any) => void;
  setMsgText: (data: any) => void;
  setMsgClass: (data: any) => void;
  earlyAccessRef: any;
}

export const Step5: React.FC<Step5Props> = ({
  onSuccess,
  onBack,
  setShowMsg,
  setMsgText,
  setMsgClass,
  earlyAccessRef
}) => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>({});
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadingResendOTP, setHasLoadingResendOTP] = useState(false);
  const [hasInvalid, setHasInvalid] = useState(false);

  const msgTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("early-access-data");
    if (!stored) return router.replace("/home_test");

    try {
      const parsed = JSON.parse(stored);
      setCachedData(parsed);
    } catch {
      router.replace("/home_test");
    }
  }, []);

  const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);

    if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current);
    msgTimeoutRef.current = setTimeout(() => {
      setShowMsg(false);
      msgTimeoutRef.current = null;
    }, 4000);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    setHasInvalid(false);

    if (e.key === "Backspace") {
      e.preventDefault();
      const updated = [...otp];

      if (otp[index]) {
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        updated[index - 1] = "";
        setOtp(updated);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    setHasInvalid(false);

    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasteData) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => {
      if (index + i < 6) newOtp[index + i] = char;
    });

    setOtp(newOtp);
    inputRefs.current[Math.min(index + pasteData.length, 5)]?.focus();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    setHasInvalid(false);

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const verifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      createMessage("Please enter the full 6-digit code.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post("/api/visitors/verify-otp", {
        email: cachedData.email,
        otp: enteredOtp,
        type: "email",
        currentStep: "6",
      });

      if (res.data.status) {
        localStorage.setItem(
          "early-access-data",
          JSON.stringify({
            ...cachedData,
            isMobileNumberVerified: true,
            currentStep: "6",
          })
        );
        onSuccess?.();
      } else {
        setHasInvalid(true);
        createMessage(res.data.message || "Invalid code", "error");
      }
    } catch {
      createMessage("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setHasInvalid(false);
    setHasLoadingResendOTP(true);

    try {
      const res = await axios.post("/api/visitors/resend-otp", {
        type: "sms",
        mobile: cachedData.mobileNumber,
        countryCode: cachedData.countryCode,
        email: cachedData.email,
      });

      if (res.data.status) {
        setOtp(["", "", "", "", "", ""]);
        createMessage(res.data.message, "success");
      } else {
        createMessage(res.data.message, "error");
      }
    } catch {
      createMessage("Unable to resend code", "error");
    } finally {
      setHasLoadingResendOTP(false);
    }
  };

  const handleBackNavigation = () => {
    const updated = { ...cachedData, currentStep: "4" };
    localStorage.setItem("early-access-data", JSON.stringify(updated));
    onBack?.();
  };

  return (
    <>
      <div ref={earlyAccessRef} className="bg-[#09073A] p-10 my-10">
        <div className="flex items-center justify-center">
          <EarlyAccessCircleVW />

          <div className="min-h-[29.875rem] ml-[5rem] xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] px-[3.125rem]">
            <h2 className="relative text-center text-xl font-bold text-white">
              <BackArrowVW onClick={handleBackNavigation} />
              Request Early Access
            </h2>

            <p className="mt-2 text-sm text-white/90">
              Step 5 of 8: Verify your mobile number.
            </p>

            <form className="mt-6" onSubmit={verifyOTP}>
              <label className="block mb-2 text-white/80">
                Enter your 6-digit code
              </label>

              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={(e) => handlePaste(e, idx)}
                    className={`w-12 h-12 rounded-lg text-center text-lg font-semibold text-white border focus:outline-none ${
                      hasInvalid
                        ? "bg-red-500/20 border-red-400"
                        : "bg-white/10 border-white/30"
                    }`}
                  />
                ))}
              </div>

              <div className="text-center mt-3 text-sm text-white/80">
                Didn’t get a code?{" "}
                <span onClick={resendOTP} className="underline cursor-pointer">
                  {hasLoadingResendOTP ? "Sending..." : "Resend"}
                </span>
              </div>

              <button
                type="submit"
                className="steps_btn_submit mt-[10.438rem] text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
              >
                {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
