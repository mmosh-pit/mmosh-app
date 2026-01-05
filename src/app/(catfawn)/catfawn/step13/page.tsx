"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { ErrorContainerVW } from "../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../components/BackArrow/BackArrowVW";
import { InputVW } from "../components/Input/InputVW";

export default function Step13VC() {
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
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.25rem] px-[3.125rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <BackArrowVW onClick={() => router.replace("/catfawn/step11")} />
          Request Early Access
        </h2>

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[88%] mt-[0.313rem] -tracking-[0.04em]">
          Step 13 of 15: Kinship Code Verification.{" "}
          <span className="font-normal font-avenir">
            Entry into the CAT FAWN Connections happens through relationship,
            trust, and reciprocity <br className="max-2xl:hidden" />. A Kinship
            Code from an existing member signals that connection.{" "}
            <br className="max-2xl:hidden" />
            If you have one, enter it now.
          </span>
        </p>

        <form
          className="mt-[1.188rem] min-h-63.5 text-base max-md:text-sm font-normal"
          onSubmit={submitKinshipCode}
        >
          <div className="text-[1rem]">
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

            <label className="flex items-center gap-0.5 text-[#FFFFFFE5] opacity-70 text-[0.75rem] max-md:text-xs leading-[140%] mt-[0.313rem] -tracking-[0.02em]">
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

          <button type="submit" className="steps_btn_submit mt-[11rem]">
            {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
          </button>
        </form>
      </div>
    </>
  );
}
