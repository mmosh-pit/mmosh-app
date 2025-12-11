// step4b
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function VerifyMobileVC() {
  const router = useRouter();

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) return router.replace("/");

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result.currentStep !== "step4/verify-mobile") {
        router.replace("/" + result.currentStep);
      }
    } catch {
      router.replace("/");
    }
  }, []);

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
      // toast.error("Please enter the full 6-digit code.");
      return;
    }

    try {
      const res = await axios.post("/api/visitors/verify-email", {
        email: cachedData.email,
        otp: enteredOtp,
        currentStep: "step5",
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "step5",
          })
        );

        router.replace("/step5");
      } else {
        // toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      // toast.error("Something went wrong");
    }
  };

  const resendOTP = async () => {
    const result = await axios.post("/api/visitors/resend-otp", {
      email: cachedData.email,
      type: "sms",
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

      <div className="min-h-118 xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-5 px-12.5 max-md:px-5 max-md:py-8">
        <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>
        <p className="text-base max-md:text-sm font-normal leading-[130%] mt-2.5 -tracking-[0.02em]">
          Step 4 of 7: Let’s Confirm Your Mobile Number. Enter the code we just
          sent you.
        </p>

        <form className="mt-2.5 min-h-[21.313rem] max-lg:min-h-[322px] text-base max-md:text-sm font-normal flex flex-col justify-between">
          <div className="max-lg:text-center">
            <label className="block mb-[0.313rem] font-normal leading-[100%]">
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
                  className="w-14 h-[3.438rem] max-lg:w-14 max-lg:h-[3.438rem] max-sm:size-6 max-xl:size-6 p-5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none"
                />
              ))}
            </div>

            <div className="text-base leading-[100%] font-normal text-[rgba(255,255,255,0.8)] flex items-center justify-between mt-[0.313rem]">
              <p>Valid for 10 minutes.</p>
              <p>
                Need a new code?{" "}
                <span className="underline" onClick={resendOTP}>
                  Resend
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
            onClick={submitOTP}
          >
            Join Early Access
          </button>
        </form>
      </div>
    </div>
  );
}
