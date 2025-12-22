"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ErrorContainerVW } from "../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../components/BackArrow/BackArrowVW";
import { InputVW } from "../components/Input/InputVW";

interface ContactDetails {
  mobileNumber: string;
  countryCode: string;
  telegramUsername: string;
  blueskyHandle: string;
  linkedinProfile: string;
  country: string;
}

export default function Step11VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
    country: "",
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("catfawn-data");

      if (!stored) {
        router.replace("/catfawn");
        return;
      }
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.completedSteps !== undefined && result?.completedSteps < 22) {
        router.replace(`/${result.currentStep}`);
      }

      setContactDetails({
        mobileNumber: result.mobileNumber || "",
        countryCode: result.countryCode || "",
        telegramUsername: result.telegramUsername || "",
        blueskyHandle: result.blueskyHandle || "",
        linkedinProfile: result.linkedinProfile || "",
        country: result.country || "",
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

  const isValidTelegram = (username: string) => {
    if (!username) return true;
    return /^@?[a-zA-Z](?!.*__)[a-zA-Z0-9_]{3,30}[a-zA-Z0-9]$/.test(username);
  };

  const isValidBluesky = (handle: string) => {
    if (!handle) return true;
    return /^(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(handle);
  };

  const isValidLinkedIn = (url: string) => {
    if (!url) return true;
    return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{3,100}\/?$/.test(
      url.trim()
    );
  };

  const updateContactDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contactDetails.mobileNumber.trim()) {
      createMessage("Mobile number is required.", "error");
      return;
    }

    if (contactDetails.mobileNumber.trim().length < 8) {
      createMessage("Please enter a valid mobile number.", "error");
      return;
    }
    const telegram = contactDetails.telegramUsername.trim();

    if (!isValidTelegram(telegram)) {
      createMessage(
        "Invalid Telegram username. Use 5–32 chars, letters, numbers, underscores.",
        "error"
      );
      return;
    }

    if (!isValidBluesky(contactDetails.blueskyHandle)) {
      createMessage(
        "Invalid Bluesky handle (example: name.bsky.social)",
        "error"
      );
      return;
    }

    if (!isValidLinkedIn(contactDetails.linkedinProfile)) {
      createMessage("Invalid LinkedIn profile URL", "error");
      return;
    }

    const numberChanged =
      cachedData.mobileNumber !== contactDetails.mobileNumber ||
      cachedData.countryCode !== contactDetails.countryCode;

    if (cachedData.isMobileNumberVerified !== true || numberChanged) {
      try {
        setIsLoading(true);
        const result = await axios.post("/api/visitors/generate-otp", {
          type: "sms",
          mobile: contactDetails.mobileNumber,
          countryCode: contactDetails.countryCode,
          email: cachedData.email,
        });

        if (result.data.status) {
          localStorage.setItem(
            "catfawn-data",
            JSON.stringify({
              ...cachedData,
              currentStep: "catfawn/step12",
              mobileNumber: contactDetails.mobileNumber,
              countryCode: contactDetails.countryCode,
              telegramUsername: telegram,
              blueskyHandle: contactDetails.blueskyHandle,
              linkedinProfile: contactDetails.linkedinProfile,
              country: contactDetails.country,
              isMobileNumberVerified: false,
              completedSteps:
                cachedData.completedSteps && cachedData.completedSteps < 23
                  ? 23
                  : cachedData.completedSteps,
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
    } else {
      localStorage.setItem(
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          currentStep: "catfawn/step13",
        })
      );
      router.replace("/catfawn/step13");
    }
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
          <BackArrowVW onClick={() => router.replace("/catfawn/step10")} />
          Request Early Access
        </h2>

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.04em]">
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

        <form className="mt-[0.313rem] text-[1rem] max-md:text-sm font-normal leading-[100%]" onSubmit={updateContactDetails}>
          <div className="flex flex-col gap-[0.25rem]">
            <div className="z-50">
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Mobile number *
              </label>
              <PhoneInput
                country={"us"}
                value={phone}
                onChange={(
                  value: string,
                  country: {
                    dialCode: string;
                    countryCode: string;
                    name: string;
                  }
                ) => {
                  if (!country?.dialCode) {
                    setContactDetails((prev) => ({
                      ...prev,
                      country: "US",
                      countryCode: "1",
                      mobileNumber: "",
                    }));
                    setPhone("");
                    return;
                  }

                  const countryCode = country.dialCode;
                  const mobileNumber = value.slice(countryCode.length);

                  setContactDetails((prev) => ({
                    ...prev,
                    mobileNumber,
                    countryCode,
                    country: country.countryCode.toUpperCase(),
                  }));

                  setPhone(value);
                }}
                inputClass="phone-input"
                buttonClass="phone-dropdown-btn"
                containerClass="phone-container"
                dropdownClass="phone-dropdown"
                enableSearch={true}
                inputProps={{
                  placeholder: "Mobile number",
                }}
                specialLabel=""
              />
            </div>
            <InputVW
              labelText="Telegram username"
              value={contactDetails.telegramUsername}
              placeHolder="@handle"
              inputType="text"
              isRequired={false}
              type="sms"
              onChange={(event) =>
                handleChange("telegramUsername", event.target.value)
              }
            />

            <InputVW
              labelText="Bluesky handle"
              value={contactDetails.blueskyHandle}
              placeHolder="@name.bsky.social"
              inputType="text"
              isRequired={false}
              type="sms"
              onChange={(event) =>
                handleChange("blueskyHandle", event.target.value)
              }
            />
            <InputVW
              labelText="LinkedIn profile (full URL)"
              value={contactDetails.linkedinProfile}
              placeHolder="http://url.com"
              inputType="text"
              isRequired={false}
              type="sms"
              onChange={(event) =>
                handleChange("linkedinProfile", event.target.value)
              }
            />

            <button
              type="submit"
              className="steps_btn_submit mt-[1.063rem]"
            >
              {isLoading ? <Spinner size="sm" /> : "Next"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
