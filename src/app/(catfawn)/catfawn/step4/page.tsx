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
    <div className="font-avenir grid grid-cols-1 lg:grid-cols-2 lg:gap-x-9 max-lg:gap-y-8 items-center">
      <div className="flex flex-col gap-7.5">
        <h1 className="text-[2.188rem] max-md:text-2xl font-bold leading-[110%] font-poppins max-lg:text-center bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Join the CAT FAWN Connection <br className="max-md:hidden" />
          Early Access Circle
        </h1>

        <div className="text-base leading-[130%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap">
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

      <div className="min-h-133.5 xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-4 px-12.5 max-md:px-5 max-md:py-8">
        <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>

        <p className="text-base max-md:text-sm font-normal leading-[130%] mt-[0.313rem] -tracking-[0.02em]">
          Step 4 of 7: Your Contact Details. Tell us how we can reach you.
        </p>

        <form className="mt-2.5 text-base max-md:text-sm font-normal leading-[100%]">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Mobile number
              </label>
              <input
                type="number"
                placeholder="Mobile number"
                className="w-full h-[3.438rem] px-[1.294rem] py-4.5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Telegram username
              </label>
              <input
                type="text"
                placeholder="@handle"
                className="w-full h-[3.438rem] px-[1.294rem] py-4.5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) =>
                  handleChange("telegramUsername", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Bluesky handle
              </label>
              <input
                type="text"
                placeholder="@name.bsky.social"
                className="w-full h-[3.438rem] px-[1.294rem] py-4.5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("blueskyHandle", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                LinkedIn profile (full URL)
              </label>
              <input
                type="text"
                placeholder="@handle"
                className="w-full h-[3.438rem] px-[1.294rem] py-4.5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) =>
                  handleChange("linkedinProfile", e.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
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
