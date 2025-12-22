"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { ErrorContainerVW } from "../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../components/BackArrow/BackArrowVW";

export default function Step9VC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState<any>({});

  const [mobilePreferences, setMobilePreferences] = React.useState<string[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/catfawn");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.completedSteps !== undefined && result?.completedSteps < 20) {
        router.replace(`/${result.currentStep}`);
      }
      if (Array.isArray(result.mobilePreference)) {
        setMobilePreferences(result.mobilePreference);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const handleMobilePreferenceChange = (value: string, checked: boolean) => {
    setMobilePreferences((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const createMessage = (message: string, type: "success" | "error") => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  const updateMobilePreference = async () => {
    setIsLoading(true);
    if (mobilePreferences.length === 0) {
      createMessage("Please select at least one mobile preference.", "error");
      setIsLoading(false);
      return;
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        currentStep: "catfawn/step10",
        mobilePreference: mobilePreferences,
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 21
            ? 21
            : cachedData.completedSteps,
      })
    );
    router.replace("/catfawn/step10");
    setIsLoading(false);
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
          <BackArrowVW onClick={() => router.replace("/catfawn/step8")} />
          Request Early Access
        </h2>
        <p className="max-sm:text-base font-avenirNext text-[#FFFFFFE5] max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 9 of 15: Which mobile platform do you prefer?
        </p>

        <form className="mt-5 lg:mt-[3.438rem] text-[1rem]">
          <div className="flex flex-col gap-1 text-[rgba(255,255,255,0.9)] text-[0.813rem] leading-[140%] -tracking-[0.02em]">
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                checked={mobilePreferences.includes("iPhone")}
                onChange={(e) =>
                  handleMobilePreferenceChange("iPhone", e.target.checked)
                }
              />
              iPhone{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                checked={mobilePreferences.includes("android")}
                onChange={(e) =>
                  handleMobilePreferenceChange("android", e.target.checked)
                }
              />
              Android{" "}
            </label>
          </div>

          <button
            type="button"
            className="steps_btn_submit mt-[14.563rem]"
            onClick={updateMobilePreference}
          >
            {isLoading ? <Spinner size="sm" /> : "Next"}
          </button>
        </form>
      </div>
    </>
  );
}
