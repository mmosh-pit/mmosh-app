"use client";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { InputVW } from "@/app/(catfawn)/catfawn/components/Input/InputVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Step7Props {
  onSuccess?: () => void;
  onBack?: () => void;
  earlyAccessRef: any;
  setShowMsg: (data: any) => void;
  setMsgText: (data: any) => void;
  setMsgClass: (data: any) => void;
}

export const Step7 = ({
  onSuccess,
  onBack,
  setShowMsg,
  setMsgText,
  setMsgClass,
  earlyAccessRef,
}: Step7Props) => {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [noCodeChecked, setNoCodeChecked] = React.useState(false);
  const [kinshipCode, setKinshipCode] = React.useState("");

  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("early-access-data");
    if (!stored) {
      return router.replace("/home_test");
    }
    try {
      const result = JSON.parse(stored);
      setCachedData(result);
      if (result?.completedSteps !== undefined && result?.completedSteps < 24) {
        router.replace(`/${result.currentStep}`);
      }
      setKinshipCode(result.referedKinshipCode);
      setNoCodeChecked(result.noCodeChecked);
    } catch {
      router.replace("/home_test");
    }
  }, []);

  const submitKinshipCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!kinshipCode && !noCodeChecked) {
      createMessage(
        "Please enter a Kinship Code or confirm that you don’t have one.",
        "error"
      );
      return;
    }

    if (noCodeChecked && !kinshipCode) {
      setIsLoading(true);
      localStorage.setItem(
        "early-access-data",
        JSON.stringify({
          ...cachedData,
          referedKinshipCode: "",
          currentStep: "8",
          noCodeChecked: true,
        })
      );
      if (onSuccess) onSuccess();
      return;
    }

    if (kinshipCode.length < 6 || kinshipCode.length > 16) {
      createMessage(
        "Kinship Code must be between 6 and 16 characters.",
        "error"
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("/api/visitors/has-code-exist", {
        code: kinshipCode,
      });

      if (!response.data?.status || !response.data?.result?.exists) {
        createMessage("Invalid Kinship Code. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        "early-access-data",
        JSON.stringify({
          ...cachedData,
          referedKinshipCode: kinshipCode,
          noCodeChecked: false,
          currentStep: "8",
        })
      );

      if (onSuccess) onSuccess();
    } catch {
      createMessage("Unable to verify Kinship Code.", "error");
      setIsLoading(false);
    }
  };

  const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleBackNavigation = () => {
    const updatedData = { ...cachedData, currentStep: "6" };
    localStorage.setItem("early-access-data", JSON.stringify(updatedData));
    setCachedData(updatedData);
    if (onBack) onBack();
  };

  return (
    <>
      <div ref={earlyAccessRef} className="bg-[#09073A] p-10 my-10">
        <div className="flex items-center justify-center">
          <EarlyAccessCircleVW />
          <div className="min-h-[29.875rem] ml-[5rem] xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
            <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
              <BackArrowVW onClick={handleBackNavigation} />
              Request Early Access
            </h2>

            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[88%] mt-5 -tracking-[0.04em]">
              Step 7 of 8: Enter a Kinship Code from your Referrer{" "}
            </p>

            <form
              className="mt-[1.188rem] min-h-63.5 text-base max-md:text-sm font-normal"
              onSubmit={submitKinshipCode}
            >
              <div className="text-[1rem] mt-[2rem]">
                <InputVW
                  labelText="Kinship Code"
                  value={kinshipCode}
                  placeHolder="Kinship Code"
                  inputType="text"
                  isRequired={false}
                  type="kinship-code"
                  onChange={(event) => {
                    setKinshipCode(event.target.value.trim());
                    if (event.target.value) setNoCodeChecked(false);
                  }}
                  minLength={6}
                  maxLength={16}
                />

                <label className="flex items-center gap-0.5 text-[#FFFFFFE5] opacity-70 text-[0.75rem] max-md:text-xs leading-[140%] mt-2 -tracking-[0.02em]">
                  {
                    <input
                      type="checkbox"
                      className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                      checked={noCodeChecked}
                      onChange={(e) => {
                        setNoCodeChecked(e.target.checked);
                        if (e.target.checked) setKinshipCode("");
                      }}
                    />
                  }
                  I don’t have a code yet — I’ll provide one later.
                </label>
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
