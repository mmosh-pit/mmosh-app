"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

export default function Step10VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});

  const [contactPreferences, setContactPreferences] = React.useState<string[]>(
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

      if (result?.completedSteps !== undefined && result?.completedSteps < 21) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const handleContactPreferenceChange = (value: string, checked: boolean) => {
    setContactPreferences((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const updateContactPreference = async () => {
    setIsLoading(true);
    if (contactPreferences.length === 0) {
      createMessage("Please select at least one contact preference.", "error");
      setIsLoading(false);
      return;
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        currentStep: "catfawn/step11",
        contactPreference: contactPreferences,
        completedSteps: 22,
      })
    );
    router.replace("/catfawn/step11");
    setIsLoading(false);
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
            className="absolute left-0"
            onClick={() => {
              router.replace("/catfawn/step9");
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
        <p className="text-[1rem] font-avenirNext text-[#FFFFFFE5] max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 10 of 15: How do you prefer to be contacted?{" "}
          <span className="text-[0.6885rem] font-normal">
            (select all that apply)
          </span>
        </p>

        <form className="mt-[3.438rem] text-[1rem]">
          <div className="flex flex-col gap-1 text-[rgba(255,255,255,0.9)] text-[0.813rem] leading-[140%] -tracking-[0.02em]">
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="sw-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleContactPreferenceChange(
                    "text-message",
                    e.target.checked
                  )
                }
              />
              Text message{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleContactPreferenceChange("telegram", e.target.checked)
                }
              />
              Telegram{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleContactPreferenceChange("whatsapp", e.target.checked)
                }
              />
              WhatsApp{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleContactPreferenceChange("email", e.target.checked)
                }
              />
              Email{" "}
            </label>
          </div>

          <button
            type="button"
            className="steps_btn_submit mt-[11.188rem]"
            onClick={updateContactPreference}
          >
            {isLoading && <Spinner size="sm" />}
            Next{" "}
          </button>
        </form>
      </div>
    </>
  );
}
