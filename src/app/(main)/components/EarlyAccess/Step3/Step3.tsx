"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { CheckBoxVW } from "@/app/(catfawn)/catfawn/components/CheckBox/CheckBoxVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";

export default function Step3() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState<any>({});

  const [roles, setRoles] = React.useState<string[]>([]);
  const [otherRoleEnabled, setOtherRoleEnabled] = React.useState(false);
  const [otherRoleText, setOtherRoleText] = React.useState("");

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  //   React.useEffect(() => {
  //     const stored = localStorage.getItem("catfawn-data");
  //     if (!stored) {
  //       return router.replace("/catfawn");
  //     }

  //     try {
  //       const result = JSON.parse(stored);
  //       setCachedData(result);

  //       if (Array.isArray(result.roles)) {
  //         setRoles(result.roles);

  //         const other = result.roles.find(
  //           (r: string) => !PREDEFINED_ROLES.includes(formatRole(r))
  //         );

  //         if (other) {
  //           setOtherRoleEnabled(true);
  //           setOtherRoleText(other.replace(/^other-/, "").replace(/-/g, " "));
  //         }
  //       }

  //       if (result?.completedSteps !== undefined && result?.completedSteps < 2) {
  //         router.replace(`/${result.currentStep}`);
  //       }
  //     } catch {
  //       router.replace("/catfawn");
  //     }
  //   }, []);

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

  const updateRoles = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      if (!/^[A-Za-z,&\/\s-]+$/.test(otherRoleText)) {
        createMessage(
          "Only letters are allowed. Special characters are not allowed.",
          "error"
        );
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
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 3
            ? 3
            : cachedData.completedSteps,
      })
    );

    router.replace("/catfawn/step4");
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
  const handleBackNavigation = () => {
    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        currentStep: "catfawn",
      })
    );
    router.replace("/catfawn");
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

            <p className="max-sm:text-base text-[#FFFFFFE5]  font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[1rem] -tracking-[0.02em]">
              Step 3 of 8: Enter your name and email address.{" "}
              <span className="font-normal font-avenir">
                {" "}
                We’ll send a link to verify it’s really you.
              </span>
            </p>
            <div className="mt-5">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Password"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Confirm Password</legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29] "
                  placeholder="Confirm Password"
                />
              </fieldset>
            </div>

            <button
              type="submit"
              className="steps_btn_submit mt-[5.438rem] text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
            >
              {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
