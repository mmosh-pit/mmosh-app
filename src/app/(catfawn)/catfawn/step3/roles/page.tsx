"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function RolesVC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [roles, setRoles] = React.useState<string[]>([]);
  const [otherRoleEnabled, setOtherRoleEnabled] = React.useState(false);
  const [otherRoleText, setOtherRoleText] = React.useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep && result.currentStep !== "step3/roles") {
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
    if (roles.length === 0 && !otherRoleText.trim()) {
      // toast.error("Please select at least one role.");
      return;
    }

    let finalRoles = [...roles];

    if (otherRoleEnabled) {
      if (!otherRoleText.trim()) {
        // toast.error("Please enter your other role.");
        return;
      }

      // convert spaces → hyphens
      const formattedOther = formatRole(otherRoleText);
      finalRoles.push(formattedOther);
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "step3/intent",
        roles: finalRoles,
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({ ...cachedData, currentStep: "step3/intent" })
        );

        router.replace("/step3/intent");
      } else {
        // toast.error(res.data.message);
      }
    } catch (err) {
      // toast.error("Something went wrong");
    }
  };

  return (
    <div className="font-avenir grid grid-cols-1 lg:grid-cols-2 max-lg:gap-y-8 items-center">
      <div className="flex flex-col gap-[1.875rem]">
        <h1 className="font-poppins text-[2.188rem] max-md:text-2xl font-bold leading-[110%] max-lg:text-center bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Join the CAT FAWN Connection <br className="max-md:hidden" />
          Early Access Circle
        </h1>

        <div className="text-[1rem] text-[#FFFFFFE5] leading-[130%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap">
          <p>
            Be among the first to use CAT FAWN Connection
            <br />
            to change yourself, change your life, and change the world.
            <br />
            As an early access member, you&apos;ll:
          </p>

          <ul>
            <li>• Experience the app before public launch</li>
            <li>• Share insights that will shape the product</li>
            <li>
              • Join live sessions + private groups with Four Arrows & Kinship
            </li>
          </ul>
        </div>
      </div>

      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.25rem] px-[3.125rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
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
          Step 3 of 14: Tell Us More About Yourself.{" "}
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
            {/* All existing checkboxes */}
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

            {/* OTHER OPTION */}
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

          {/* SHOW INPUT ONLY IF OTHER IS SELECTED */}
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
            className="font-avenirNext mt-[4.375rem] h-[3.125rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
            onClick={updateRoles}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
