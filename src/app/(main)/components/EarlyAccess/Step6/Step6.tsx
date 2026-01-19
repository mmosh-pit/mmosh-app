"use client";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { CheckBoxVW } from "@/app/(catfawn)/catfawn/components/CheckBox/CheckBoxVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

interface Step6Props {
  onSuccess?: () => void;
  onBack?: () => void;
}

export const Step6: React.FC<Step6Props> = ({ onSuccess, onBack }) => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>({});
  const [mobilePreferences, setMobilePreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

  const msgTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("early-access-data");
    if (!stored) return router.replace("/home_test");

    try {
      const parsed = JSON.parse(stored);
      setCachedData(parsed);
      if (Array.isArray(parsed.mobilePreferences))
        setMobilePreferences(parsed.mobilePreferences);

      if (parsed?.completedSteps !== undefined && parsed.completedSteps < 3) {
        router.replace(`/${parsed.currentStep}`);
      }
    } catch {
      router.replace("/home_test");
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

  const formatPreference = (value: string) => value.trim().toLowerCase();

  const handlePreferenceChange = (value: string, checked: boolean) => {
    const formatted = formatPreference(value);
    setMobilePreferences((prev) =>
      checked
        ? Array.from(new Set([...prev, formatted]))
        : prev.filter((i) => i !== formatted)
    );
  };

  const updatePreferences = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mobilePreferences.length === 0) {
      createMessage("Please select at least one mobile platform.", "error");
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem(
        "early-access-data",
        JSON.stringify({
          ...cachedData,
          mobilePreferences,
          currentStep: "7",
        })
      );
      if (onSuccess) onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackNavigation = () => {
    const updatedData = { ...cachedData, currentStep: "5" };
    localStorage.setItem("early-access-data", JSON.stringify(updatedData));
    setCachedData(updatedData);
    if (onBack) onBack();
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
              <BackArrowVW onClick={handleBackNavigation} />
              Request Early Access
            </h2>
            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[130%] mt-[0.313rem] -tracking-[0.02em]">
              Step 6 of 8: Which mobile platform do you prefer?
            </p>

            <form
              className="min-h-[313px] mt-[0.875rem] text-[1rem] flex flex-col justify-between"
              onSubmit={updatePreferences}
            >
              <div className="flex flex-col gap-1 text-[#FFFFFFE5] text-[0.813rem] font-normal leading-[110%] -tracking-[0.02em]">
                <CheckBoxVW
                  labelText="iPhone"
                  hasChecked={mobilePreferences.includes(formatPreference("iphone"))}
                  onChange={(e) => handlePreferenceChange("iphone", e.target.checked)}
                />
                <CheckBoxVW
                  labelText="Android"
                  hasChecked={mobilePreferences.includes(formatPreference("android"))}
                  onChange={(e) => handlePreferenceChange("android", e.target.checked)}
                />
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
