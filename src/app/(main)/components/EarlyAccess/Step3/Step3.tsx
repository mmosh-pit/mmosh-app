"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import { encryptData } from "@/utils/decryptData";

interface Step3Props {
  onSuccess?: () => void;
  onBack?: () => void;
  earlyAccessRef: any;
  setShowMsg: (data: any) => void;
  setMsgText: (data: any) => void;
  setMsgClass: (data: any) => void;
}

export const Step3: React.FC<Step3Props> = ({
  onSuccess,
  onBack,
  setShowMsg,
  setMsgText,
  setMsgClass,
  earlyAccessRef
}) => {
  const [cachedData, setCachedData] = React.useState<any>({});
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load cached data on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("early-access-data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCachedData(parsed);
        if (parsed.password) setPassword(parsed.password); // optionally prefill encrypted password
      } catch {
        localStorage.removeItem("early-access-data");
      }
    }
  }, []);

  const createMessage = (message: string, type: "error" | "success") => {
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);

    if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current);
    msgTimeoutRef.current = setTimeout(() => {
      setShowMsg(false);
      msgTimeoutRef.current = null;
    }, 4000);
  };

  const handleBackNavigation = () => {
    const updatedData = {
      ...cachedData,
      currentStep: "2",
    };
    localStorage.setItem("early-access-data", JSON.stringify(updatedData));
    setCachedData(updatedData);

    if (onBack) onBack();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!password) {
      createMessage("Password is required", "error");
      return;
    }
    if (password.length < 6) {
      createMessage("Password must be at least 6 characters", "error");
      return;
    }
    if (password.length > 32) {
      createMessage("Password must not exceed 32 characters", "error");
      return;
    }
    if (/\p{Extended_Pictographic}/u.test(password)) {
      createMessage("Password should not contain emojis", "error");
      return;
    }
    if (!confirmPassword) {
      createMessage("Confirm password is required", "error");
      return;
    }
    if (password !== confirmPassword) {
      createMessage("Password and Confirm Password do not match", "error");
      return;
    }

    // Save to localStorage
    const updatedData = {
      ...cachedData,
      password: encryptData(password),
      currentStep: "4",
    };
    localStorage.setItem("early-access-data", JSON.stringify(updatedData));
    setCachedData(updatedData);

    if (onSuccess) onSuccess();
  };

  return (
    <>
      <div ref={earlyAccessRef} className="bg-[#09073A] p-10 my-10">
        <div className="lg:flex items-center justify-center">
          <EarlyAccessCircleVW />
          <form
            className="min-h-[29.875rem] lg:ml-[5rem] m-2  xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8"
            onSubmit={handleSubmit}
          >
            <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
              <BackArrowVW onClick={handleBackNavigation} />
              Request Early Access
            </h2>

            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[1rem] -tracking-[0.02em]">
              Step 3 of 8: Set your password.
              <span className="font-normal font-avenir">
                {" "}
                Make sure it’s at least 6 characters.
              </span>
            </p>

            <div className="mt-5">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input
                  type="password"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Confirm Password</legend>
                <input
                  type="password"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </fieldset>
            </div>

            <button
              type="submit"
              className="steps_btn_submit mt-[5.438rem] text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
            >
              {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
