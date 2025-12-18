"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

export default function Step3VC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState<any>({});

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
      return router.replace("/catfawn");
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (Array.isArray(result.roles)) {
        setRoles(result.roles);

        const other = result.roles.find(
          (r: string) => !PREDEFINED_ROLES.includes(formatRole(r))
        );

        if (other) {
          setOtherRoleEnabled(true);
          setOtherRoleText(other.replace(/^other-/, "").replace(/-/g, " "));
        }
      }

      if (result?.completedSteps !== undefined && result?.completedSteps < 2) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const formatRole = (value: string) => value.trim().replace(/\s+/g, "-");

  const PREDEFINED_ROLES = [
    "change-maker/activist/advocate",
    "educator/teacher",
    "coach/trainer/guide",
    "healer/therapist",
    "leader",
    "student/learner",
  ].map(formatRole);

  const handleRoleChange = (value: string, checked: boolean) => {
    if (value === "other") {
      setOtherRoleEnabled(checked);
      if (!checked) setOtherRoleText("");
      return;
    }

    const formatted = formatRole(value);

    setRoles((prev) =>
      checked
        ? Array.from(new Set([...prev, formatted]))
        : prev.filter((item) => item !== formatted)
    );
  };

  const updateRoles = () => {
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

    let finalRoles = roles.filter((role) =>
      PREDEFINED_ROLES.includes(formatRole(role))
    );

    if (otherRoleEnabled) {
      if (!otherRoleText.trim()) {
        createMessage("Please enter your other role.", "error");
        setIsLoading(false);
        return;
      }

      if (otherRoleText.trim().length < 3 || otherRoleText.trim().length > 30) {
        createMessage(
          "Other role must be between 3 and 30 characters.",
          "error"
        );
        setIsLoading(false);
        return;
      }

      finalRoles.push(`other-${otherRoleText.trim().replace(/\s+/g, "-")}`);
    }

    finalRoles = Array.from(new Set(finalRoles));

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        roles: finalRoles,
        currentStep: "catfawn/step4",
        completedSteps: 3,
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
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer"
            onClick={() => {
              localStorage.setItem(
                "catfawn-data",
                JSON.stringify({
                  ...cachedData,
                  currentStep: "catfawn",
                })
              );
              router.replace("/catfawn");
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

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 3 of 15: Tell Us More About Yourself.{" "}
          <span className="font-normal font-avenir">
            {" "}
            The CAT FAWN Connection Early Access Program is for change makers,
            educators, healers, and leaders who are ready and willing to shape
            the future. Please tell us more about yourself and how we can reach
            you.
          </span>
        </p>

        <div className="max-sm:text-base font-bold leading-snug lg:leading-[100%] text-[#FFFFFFCC] mt-[0.563rem]">
          How do you see yourself in the world?{" "}
          <span className="text-[0.6885rem] font-normal">
            (select all that apply, required)
          </span>
        </div>

        <form className="mt-[0.563rem] text-[1rem]">
          <div className="flex flex-col gap-1 text-[#FFFFFFE5] font-normal text-[0.813rem] leading-[140%] -tracking-[0.02em]">
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                checked={roles.includes(
                  formatRole("change-maker/activist/advocate")
                )}
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
                checked={roles.includes(formatRole("educator/teacher"))}
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
                checked={roles.includes(formatRole("coach/trainer/guide"))}
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
                checked={roles.includes(formatRole("healer/therapist"))}
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
                checked={roles.includes(formatRole("leader"))}
                onChange={(e) => handleRoleChange("leader", e.target.checked)}
              />
              Leader
            </label>

            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                checked={roles.includes(formatRole("student/learner"))}
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
              className="w-full xl:w-[29.688rem] mt-[0.563rem] h-[2.375rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
              maxLength={30}
            />
          )}

          <button
            type="button"
            className={`steps_btn_submit ${otherRoleEnabled ? "mt-[1.438rem]" : " mt-[4.375rem]"}`}
            onClick={updateRoles}
          >
            {isLoading && <Spinner size="sm" />} Next
          </button>
        </form>
      </div>
    </>
  );
}
