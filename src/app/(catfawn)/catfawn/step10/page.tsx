"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { ErrorContainerVW } from "../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../components/BackArrow/BackArrowVW";
import { CheckBoxVW } from "../components/CheckBox/CheckBoxVW";

export default function Step10VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  

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

      if (Array.isArray(result.contactPreference)) {
        setContactPreferences(result.contactPreference);
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

  const updateContactPreference = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 22
            ? 22
            : cachedData.completedSteps,
      })
    );
    router.replace("/catfawn/step11");
    setIsLoading(false);
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
          <BackArrowVW onClick={() => router.replace("/catfawn/step9")} />
          Request Early Access
        </h2>
        <p className="max-sm:text-base font-avenirNext text-[#FFFFFFE5] max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 10 of 15: How do you prefer to be contacted?{" "}
          <span className="text-[0.6885rem] font-normal">
            (select all that apply)
          </span>
        </p>

        <form className="mt-6 lg:mt-[3.438rem] text-[1rem]" onSubmit={updateContactPreference}>
          <div className="flex flex-col gap-1 text-[rgba(255,255,255,0.9)] text-[0.813rem] leading-[140%] -tracking-[0.02em]">
            <CheckBoxVW
              labelText="Text message"
              hasChecked={contactPreferences.includes("text-message")}
              onChange={(e) =>
                handleContactPreferenceChange("text-message", e.target.checked)
              }
            />
            <CheckBoxVW
              labelText="Telegram"
              hasChecked={contactPreferences.includes("telegram")}
              onChange={(e) =>
                handleContactPreferenceChange("telegram", e.target.checked)
              }
            />
            <CheckBoxVW
              labelText="WhatsApp"
              hasChecked={contactPreferences.includes("whatsapp")}
              onChange={(e) =>
                handleContactPreferenceChange("whatsapp", e.target.checked)
              }
            />
            <CheckBoxVW
              labelText="Email"
              hasChecked={contactPreferences.includes("email")}
              onChange={(e) =>
                handleContactPreferenceChange("email", e.target.checked)
              }
            />
          </div>

          <button
            type="submit"
            className="steps_btn_submit mt-[11.188rem]"
          >
            {isLoading ? <Spinner size="sm" /> : "Next"}
          </button>
        </form>
      </div>
    </>
  );
}
