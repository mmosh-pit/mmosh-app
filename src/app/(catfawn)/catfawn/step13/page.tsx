"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

export default function Step13VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const [noCodeChecked, setNoCodeChecked] = React.useState(false);
  const [kinshipCode, setKinshipCode] = React.useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      return router.replace("/catfawn");
    }
    try {
      const result = JSON.parse(stored);
      setCachedData(result);
      if (result?.completedSteps !== undefined && result?.completedSteps < 24) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const submitKinshipCode = async () => {
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
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          currentStep: "catfawn/step14",
          noCodeChecked: true,
        })
      );
      router.replace("/catfawn/step14");
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

      if (!response.data?.status) {
        createMessage("Invalid Kinship Code. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          referedKinshipCode: kinshipCode,
          currentStep: "catfawn/step14",
          completedSteps: 25,
        })
      );

      router.replace("/catfawn/step14");
    } catch {
      createMessage("Unable to verify Kinship Code.", "error");
      setIsLoading(false);
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
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0"
            onClick={() => {
              router.replace("/catfawn/step12");
            }}
          >
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

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[88%] mt-[0.313rem] -tracking-[0.04em]">
          Step 13 of 15: Kinship Code Verification.{" "}
          <span className="font-normal font-avenir">
            Entry into the CAT FAWN Connections happens through relationship,
            trust, and reciprocity.
          </span>
        </p>

        <form className="mt-[1.188rem] min-h-63.5 text-base max-md:text-sm font-normal">
          <div>
            <label className="block text-[1rem] mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
              Kinship Code
            </label>
            <input
              type="text"
              placeholder="Kinship Code"
              minLength={6}
              maxLength={16}
              className="w-full h-[3.438rem] px-[1.25rem] py-[1.125rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-40 text-[1rem]"
              value={kinshipCode}
              onChange={(e) => {
                setKinshipCode(e.target.value.trim());
                if (e.target.value) setNoCodeChecked(false);
              }}
            />

            <label className="flex items-center gap-0.5 text-[#FFFFFFE5] opacity-70 text-[0.813rem] max-md:text-xs leading-[140%] mt-[0.313rem] -tracking-[0.02em]">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                checked={noCodeChecked}
                onChange={(e) => {
                  setNoCodeChecked(e.target.checked);
                  if (e.target.checked) setKinshipCode("");
                }}
              />
              I don’t have a code yet — I’ll provide one later.
            </label>
          </div>

          <button
            type="button"
            className="steps_btn_submit mt-[11rem]"
            onClick={submitKinshipCode}
          >
            {isLoading && <Spinner size="sm" />}
            Join Early Access
          </button>
        </form>
      </div>
    </>
  );
}
