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
    <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
      <h2 className="relative font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
        Request Early Access
      </h2>
      <p className="text-[1rem] font-avenirNext max-md:text-sm font-bold leading-[130%] mt-[0.313rem] -tracking-[0.06em]">
        Step 2 of 14: Check your email to confirm your early access request{" "}
        <span className="text-[#FFFFFFE5] font-normal fonnt-avenir -tracking-[0.02em]">
          {" "}
          We’ve sent a 6-digit verification code to frankie@mail.com{" "}
        </span>
        <div className="mt-[0.563rem] text-[0.938rem] text-[#FFFFFFE5] leading-[105%] max-md:text-sm font-normal max-lg:w-max max-lg:text-start text-wrap -tracking-[0.02em]">
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
                className={`w-14 h-[3.438rem] max-lg:w-14 max-lg:h-[3.438rem] max-sm:w-8 max-sm:h-8 max-xl:w-6 max-xl:h-6 p-5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none focus:bg-[#F8060624] focus:border-[#F806068F] ${
                  digit
                    ? "bg-[#F8060624] border-[#F806068F]" // When filled
                    : "bg-[#402A2A] border-[#FFFFFF29]"
                } `}
              />
            ))}
          </div>

          <span className="text-[0.75rem] text-[rgba(255,255,255,0.9)] opacity-70 leading-[140%] font-normal -tracking-[0.02em]">
            The code expires in 15 minutes. Didn’t get it? Check your spam
            folder or request a new code.
          </span>

          <div className="text-center text-[0.875rem] text-[#FFFFFFE5] mt-[0.813rem] leading-[140%] font-normal -tracking-[0.02em]">
            Didn’t get a code?{" "}
            <span onClick={resendOTP} className="cursor-pointer underline">
              request code
            </span>
          </div>
        </div>

        <button
          type="button"
          className="font-avenirNext h-[3.125rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90 mt-[5.438rem]"
          onClick={verifyOTP}
          disabled={otp.join("").length !== 6}
        >
          Confirm My Early Access{" "}
        </button>
      </form>
    </div>
  );
}
