"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";
import { PhoneInput, PhoneInputResponseType } from "react-simple-phone-input";
import "react-simple-phone-input/dist/style.css";
interface ContactDetails {
  mobileNumber: string;
  countryCode: string;
  telegramUsername: string;
  blueskyHandle: string;
  linkedinProfile: string;
}

export default function Step11VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [phone, setPhone] = useState("");

  const [contactDetails, setContactDetails] = React.useState<ContactDetails>({
    mobileNumber: "",
    countryCode: "",
    telegramUsername: "",
    blueskyHandle: "",
    linkedinProfile: "",
  });


  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/catfawn");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.completedSteps !== undefined && result?.completedSteps < 22) {
        router.replace(`/${result.currentStep}`);
      }

      setContactDetails({
        mobileNumber: cachedData.mobileNumber || "",
        countryCode: result.countryCode || "",
        telegramUsername: result.telegramUsername || "",
        blueskyHandle: result.blueskyHandle || "",
        linkedinProfile: result.linkedinProfile || "",
      });

      if (result.mobileNumber && result.countryCode) {
        setPhone(`+${result.countryCode}${result.mobileNumber}`);
      }
    } catch {
      router.replace("/catfawn");
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
      createMessage("Mobile number is required.", "error");
      return;
    }

    if (contactDetails.mobileNumber.trim().length < 8) {
      createMessage("Please enter a valid mobile number.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const result = await axios.post(
        "/api/visitors/generate-otp",
        {
          type: "sms",
          mobile: contactDetails.mobileNumber,
          countryCode: contactDetails.countryCode,
          email: cachedData.email
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );


      if (result.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "catfawn/step12",
            mobileNumber: contactDetails.mobileNumber,
            countryCode: contactDetails.countryCode,
            telegramUsername: contactDetails.telegramUsername,
            blueskyHandle: contactDetails.blueskyHandle,
            linkedinProfile: contactDetails.linkedinProfile,
            completedSteps: 23,
          })
        );

        router.replace("/catfawn/step12");
      } else {
        createMessage(
          result.data.message || "Please check the mobile number",
          "error"
        );
      }
    } catch {
      createMessage("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
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
            className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer"
            onClick={() => {
              router.replace("/catfawn/step10");
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

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.04em]">
          Step 11 of 15: Your Contact Details.{" "}
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
            <div className="z-50">
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Mobile number *
              </label>
              {/* <input
                type="number"
                placeholder="Mobile number"
                value={contactDetails.mobileNumber}
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
    onChange={(e) => {
                  if (!/^[0-9]*$/.test(e.target.value)) return;
                  handleChange("mobileNumber", e.target.value)
                }}              /> */}

              <PhoneInput
                country="US"
                value={contactDetails.mobileNumber}
                onChange={(data) => {
                  const countryCode = data.dialCode.replace("+", "");
                  const mobileNumber = data.valueWithoutPlus.slice(countryCode.length);

                  setContactDetails((prev) => ({
                    ...prev,
                    mobileNumber,
                    countryCode,
                  }));

                  setPhone(data.value);
                }}

                // onChange={(data: PhoneInputResponseType) => {
                //   if (!/^[0-9]*$/.test(data.value)) return;
                //   handleChange("mobileNumber", data.value)
                // }}
                placeholder="Mobile number"
                search={true}
                iconComponent={
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 0.5L5.10217 4.81454C5.50572 5.19286 6.13974 5.1717 6.51717 4.76732L10.5 0.5"
                      stroke="white"
                      stroke-linecap="round"
                    />
                  </svg>
                }
                buttonClass="phone-dropdown-btn"
                containerClass="phone-container"
                inputClass="phone-input"
                dropdownClass="phone-dropdown"
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Telegram username
              </label>
              <input
                type="text"
                value={contactDetails.telegramUsername}
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
                value={contactDetails.blueskyHandle}
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
                value={contactDetails.linkedinProfile}
                placeholder="http://url.com"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) =>
                  handleChange("linkedinProfile", e.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="steps_btn_submit mt-[1.063rem]"
              onClick={updateContactDetails}
            >
              {isLoading && <Spinner size="sm" />}
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
