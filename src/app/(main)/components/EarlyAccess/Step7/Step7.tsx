"use client";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { InputVW } from "@/app/(catfawn)/catfawn/components/Input/InputVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Step7() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
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
      setKinshipCode(result.referedKinshipCode);
      setNoCodeChecked(result.noCodeChecked);
    } catch {
      router.replace("/catfawn");
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
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          referedKinshipCode: "",
          currentStep: "catfawn/step14",
          noCodeChecked: true,
          completedSteps:
            cachedData.completedSteps && cachedData.completedSteps < 25
              ? 25
              : cachedData.completedSteps,
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

      if (!response.data?.status || !response.data?.result?.exists) {
        createMessage("Invalid Kinship Code. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          referedKinshipCode: kinshipCode,
          noCodeChecked: false,
          currentStep: "catfawn/step14",
          completedSteps:
            cachedData.completedSteps && cachedData.completedSteps < 25
              ? 25
              : cachedData.completedSteps,
        })
      );

      router.replace("/catfawn/step14");
    } catch {
      createMessage("Unable to verify Kinship Code.", "error");
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
      <div className="bg-[#09073A] p-10 my-10">
        <div className="flex items-center justify-center">
          <EarlyAccessCircleVW />
          <div className="min-h-[29.875rem] ml-[5rem] xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
            <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
              <BackArrowVW onClick={() => router.replace("/catfawn/step11")} />
              Request Early Access
            </h2>

            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[88%] mt-5 -tracking-[0.04em]">
              Step 7 of 8: Enter a Kinship Code from your Referrer. <br />
              <span className="font-normal font-avenir">
                Tell us about yourself, challenges you may be facing, and your
                major aspirations. From what you’ve learned, how can Kinship
                Intelligence support you and your work in the world? What can
                you bring to contribute to our cooperative?
              </span>
            </p>

            <form
              className="mt-[1.188rem] min-h-63.5 text-base max-md:text-sm font-normal"
              onSubmit={submitKinshipCode}
            >
              <div className="text-[1rem]">
              <textarea placeholder="5,000 characters" className="textarea textarea-xs w-full min-h-[12rem] bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"></textarea>
              </div>

              <button
                type="submit"
                className="steps_btn_submit mt-2 text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
              >
                {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
