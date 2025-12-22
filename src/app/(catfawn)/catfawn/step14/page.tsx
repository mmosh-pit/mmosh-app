"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { ErrorContainerVW } from "../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../components/BackArrow/BackArrowVW";

export default function Step14VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
      if (result?.completedSteps !== undefined && result?.completedSteps < 25) {
        router.replace(`/${result.currentStep}`);
      }
      setKinshipCode(result.kinshipCode || "");
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const submitNewKinshipCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!kinshipCode) {
      createMessage("Please enter the Kinship code", "error");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(kinshipCode)) {
      createMessage(
        "Kinship Code must contain only letters and numbers.",
        "error"
      );
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

      if (response.data?.result?.exists) {
        createMessage(
          "This Kinship Code already exists. Please choose another one.",
          "error"
        );
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          kinshipCode: kinshipCode,
          currentStep: "catfawn/step15",
          completedSteps:
            cachedData.completedSteps && cachedData.completedSteps < 26
              ? 26
              : cachedData.completedSteps,
        })
      );

      router.replace("/catfawn/step15");
    } catch {
      createMessage("Unable to validate Kinship Code.", "error");
      setIsLoading(false);
    }
  };

 const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo(0, 0);

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

  return (
    <>
      <ErrorContainerVW
        showMessage={showMsg}
        className={msgClass}
        messageText={msgText}
      />
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] px-[3.125rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <BackArrowVW onClick={() => router.replace("/catfawn/step13")} />
          Request Early Access
        </h2>

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 14 of 15: Create Your Own Kinship Code.
          <span className="font-normal font-avenir">
            Every person in the Kinship ecosystem carries a unique code — a way
            of extending relationship, trust, and reciprocity.
          </span>
        </p>

        <form className="mt-[0.875rem] min-h-63.5 text-base max-md:text-sm font-normal" onSubmit={submitNewKinshipCode}>
          <div>
            <label className="block text-[1rem] mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
              Set your Kinship Code
            </label>
            <input
              type="text"
              value={kinshipCode}
              onChange={(e) => setKinshipCode(e.target.value.trim())}
              minLength={6}
              maxLength={16}
              placeholder="Set your Kinship Code"
              className="w-full h-[3.438rem] px-[1.25rem] py-[1.125rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-40 text-[1rem]"
            />
          </div>

          <button
            type="submit"
            className="steps_btn_submit mt-[11.813rem]"
          >
            {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
          </button>
        </form>
      </div>
    </>
  );
}
