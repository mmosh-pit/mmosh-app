// step2
"use client";
import React from "react";
import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
import axios from "axios";

export default function Step2VC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep && result.currentStep !== "step2") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      // toast.error("Please enter all 6 digits");
      return;
    }

    try {
      const result = await axios.post("/api/visitors/verify-email", {
        email: cachedData.email,
        otp: code,
        currentStep: "step3/roles",
      });

      if (result.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            currentStep: "step3/roles",
            email: cachedData.email,
          })
        );

        // toast.success("OTP Verified!");
        router.replace("/step3/roles");
      } else {
        // toast.error(result.data.message || "Invalid verification code.");
      }
    } catch (err) {
      // toast.error("Something went wrong. Try again.");
    }
  };

  const resendOTP = async () => {
    const result = await axios.post("/api/visitors/resend-otp", {
      email: cachedData.email,
      type: "email",
    });
    if (result.data.status) {
      // toast.success(result.data.message);
    } else {
      // toast.error(result.data.message);
    }
  };

  return (
    <div className="font-avenir grid grid-cols-1 lg:grid-cols-2 lg:gap-x-9 max-lg:gap-y-8 items-center">
      <div className="flex flex-col gap-7.5">
        <h1 className="text-[2.188rem] max-md:text-2xl font-bold leading-[110%] font-poppins max-lg:text-center bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Join the CAT FAWN Connection <br className="max-md:hidden" />
          Early Access Circle
        </h1>

        <div className="text-base leading-[130%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap">
          <p>
            Be among the first to use CAT FAWN Connection
            <br />
            to change yourself, change your life, and change the world.
            <br />
            As an early access member, you&apos;ll:
          </p>

          <ul>
            <li>• Experience the app before public launch</li>
            <li>• Share insights that will shape the product</li>
            <li>
              • Join live sessions + private groups with Four Arrows & Kinship
            </li>
          </ul>
        </div>
      </div>

      <div className="min-h-119.5 xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-8.5 ps-13 pe-[3.063rem] max-md:px-5 max-md:py-8">
        <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>
        <p className="text-base max-md:text-sm font-normal leading-[130%] mt-[0.313rem]">
          Step 2 of 7: Check your email to confirm your early access request
          We’ve sent a 6-digit verification code to frankie@mail.com
        </p>

        <form className="mt-8.5 min-h-[295px] max-lg:min-h-[322px] text-base max-md:text-sm font-normal flex flex-col justify-between">
          <div className="max-lg:text-center">
            <label className="block mb-[0.313rem] text-base leading-[100%] text-[#FFFFFFCC]">
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
                  className="w-14  h-[3.438rem] max-lg:w-14 max-lg:h-[3.438rem] max-sm:size-6 max-xl:size-6 p-5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none"
                />
              ))}
            </div>

            <span
              className="text-[0.688rem] text-[rgba(255,255,255,0.9)] opacity-70 leading-[140%] font-normal -tracking-[0.02em]"
            >
              The code expires in 15 minutes. Didn’t get it? Check spam or  <span onClick={resendOTP} className="cursor-pointer underline">request a new code</span>
            </span>
          </div>

          <button
            type="button"
            className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
            onClick={verifyOTP}
            disabled={otp.join("").length !== 6}
          >
            Join Early Access
          </button>
        </form>
      </div>
    </div>
  );
}
