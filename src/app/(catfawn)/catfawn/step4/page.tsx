// step4a
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

interface ContactDetails {
  mobileNumber: string;
  telegramUsername: string;
  blueskyHandle: string;
  linkedinProfile: string;
}

export default function Step4VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [contactDetails, setContactDetails] = React.useState<ContactDetails>({
    mobileNumber: "",
    telegramUsername: "",
    blueskyHandle: "",
    linkedinProfile: "",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep !== "step4") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateContactDetails = async () => {
    if (!contactDetails.mobileNumber.trim()) {
      // toast.error("Mobile number is required.");
      return;
    }

    if (contactDetails.mobileNumber.trim().length < 8) {
      // toast.error("Please enter a valid mobile number.");
      return;
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "step4/verify-mobile",
        ...contactDetails,
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "step4/verify-mobile",
          })
        );

        router.replace("/step4/verify-mobile");
      } else {
        // toast.error(res.data.message || "Unable to update contact details.");
      }
    } catch (err) {
      console.error(err);
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

        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.04em]">
          Step 11 of 14: Your Contact Details.{" "}
          <span className="font-normal font-avenir">
            {" "}
            The CAT FAWN Connection is more than a mobile app. CAT FAWN
            intelligence will be available to you through text messaging,
            messaging apps and social networks. Please let us know the various
            ways the CAT FAWN can reach you. You will have the option to opt-out
            at any time.
          </span>
        </p>

        <form className="mt-[0.313rem] text-[1rem] max-md:text-sm font-normal leading-[100%]">
          <div className="flex flex-col gap-[0.25rem]">
            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Mobile number
              </label>
              <input
                type="number"
                placeholder="Mobile number"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Telegram username
              </label>
              <input
                type="text"
                placeholder="@handle"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) =>
                  handleChange("telegramUsername", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Bluesky handle
              </label>
              <input
                type="text"
                placeholder="@name.bsky.social"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem]  rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("blueskyHandle", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                LinkedIn profile (full URL)
              </label>
              <input
                type="text"
                placeholder="http://url.com"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) =>
                  handleChange("linkedinProfile", e.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="font-avenirNext h-[3.125rem]  mt-[1.063rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
              onClick={updateContactDetails}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
