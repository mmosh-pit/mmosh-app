// step3d
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function Step10VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [contactPreferences, setContactPreferences] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (
        result?.currentStep &&
        result.currentStep !== "step3/contact-preference"
      ) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleContactPreferenceChange = (value: string, checked: boolean) => {
    setContactPreferences((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const updateContactPreference = async () => {
    if (contactPreferences.length === 0) {
      // toast.error("Please select at least one contact preference.");
      return;
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "step4",
        contactPreference: contactPreferences,
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "step4",
          })
        );

        router.replace("/step4");
      } else {
        // toast.error(res.data.message);
      }
    } catch (err) {
      // toast.error("Something went wrong");
    }
  };
  return (
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
      <p className="text-[1rem] font-avenirNext text-[#FFFFFFE5] max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
        Step 10 of 14: How do you prefer to be contacted?{" "}
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
                handleContactPreferenceChange("text-message", e.target.checked)
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
          className="font-avenirNext w-full py-[1.063rem] bg-[#FF710F] mt-[11.188rem] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
          onClick={updateContactPreference}
        >
          Next{" "}
        </button>
      </form>
    </div>
  );
}
