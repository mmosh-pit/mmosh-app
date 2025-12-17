"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

export default function Step3VC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [roles, setRoles] = React.useState<string[]>([]);
  const [otherRoleEnabled, setOtherRoleEnabled] = React.useState(false);
  const [otherRoleText, setOtherRoleText] = React.useState("");

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep && result.currentStep !== "catfawn/step3") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const formatRole = (value: string) => {
    return value.trim().toLowerCase().replace(/\s+/g, "-");
  };

  const handleRoleChange = (value: string, checked: boolean) => {
    if (value === "other") {
      setOtherRoleEnabled(checked);

      if (!checked) {
        setOtherRoleText("");
        setRoles((prev) => prev.filter((item) => item !== "other-custom"));
      }

      return;
    }

    const formatted = formatRole(value);

    if (checked) {
      setRoles((prev) => [...prev, formatted]);
    } else {
      setRoles((prev) => prev.filter((item) => item !== formatted));
    }
  };

  const updateRoles = async () => {
    setIsLoading(true);
    if (roles.length === 0 && !otherRoleText.trim()) {
      createMessage(
        otherRoleEnabled
          ? "Please enter a valid role to proceed."
          : "Please select at least one role.",
        "error"
      );
      setIsLoading(false);
      return;
    }

    let finalRoles = [...roles];

    if (otherRoleEnabled) {
      if (!otherRoleText.trim()) {
        createMessage("Please enter your other role.", "error");
        setIsLoading(false);
        return;
      }

      const formattedOther = formatRole(otherRoleText);
      finalRoles.push(formattedOther);
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        roles: finalRoles,
        currentStep: "catfawn/step4",
      })
    );
    router.replace("/catfawn/step4");
    setIsLoading(false);
  };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 4000);
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
          <div className="absolute left-0">
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

        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 3 of 15: Tell Us More About Yourself.{" "}
          <span className="font-normal font-avenir">
            {" "}
            The CAT FAWN Connection Early Access Program is for change makers,
            educators, healers, and leaders who are ready and willing to shape
            the future. Please tell us more about yourself and how we can reach
            you.
          </span>
        </p>

        <div className="text-[1rem] font-bold leading-[100%] text-[#FFFFFFCC] mt-[0.563rem]">
          How do you see yourself in the world?{" "}
          <span className="text-[0.6885rem] font-normal">
            (select all that apply, required)
          </span>
        </div>

        <form className="mt-[0.563rem] text-[1rem]">
          <div className="flex flex-col gap-1 text-[#FFFFFFE5] text-[0.813rem] leading-[140%] -tracking-[0.02em]">
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleRoleChange(
                    "change-maker/activist/advocate",
                    e.target.checked
                  )
                }
              />
              Change-maker/Activist/Advocate
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleRoleChange("educator/teacher", e.target.checked)
                }
              />
              Educator/Teacher
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleRoleChange("coach/trainer/guide", e.target.checked)
                }
              />
              Coach/Trainer/Guide
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleRoleChange("healer/therapist", e.target.checked)
                }
              />
              Healer/Therapist
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) => handleRoleChange("leader", e.target.checked)}
              />
              Leader
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleRoleChange("student/learner", e.target.checked)
                }
              />
              Student/Learner
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="size-[1.438rem] rounded-[0.313rem]"
                checked={otherRoleEnabled}
                onChange={(e) => {
                  handleRoleChange("other", e.target.checked);
                }}
              />
              Other
            </label>
          </div>

          {otherRoleEnabled && (
            <input
              type="text"
              value={otherRoleText}
              onChange={(e) => setOtherRoleText(e.target.value)}
              placeholder="Please share how you see yourself in the world."
              className="text-[0.813rem] w-full h-[2.375rem] pl-[0.688rem] pe-[0.625rem] py-[0.625rem] rounded-[0.313rem] bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-60 placeholder:font-normal placeholder:leading-[140%] mt-[0.563rem]"
            />
          )}

          <button
            type="button"
            className="font-avenirNext flex justify-center items-center gap-2 mt-[4.375rem] h-[3.125rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
            onClick={updateRoles}
          >
            {isLoading && <Spinner size="sm" />} Next
          </button>
        </form>
      </div>
    </>
  );
}
