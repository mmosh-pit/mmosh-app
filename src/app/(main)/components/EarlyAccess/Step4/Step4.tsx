"use client";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { InputVW } from "@/app/(catfawn)/catfawn/components/Input/InputVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface ContactDetails {
  mobileNumber: string;
  countryCode: string;
  country: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

interface Step4Props {
  onSuccess?: () => void;
  onBack?: () => void;
  earlyAccessRef: any;
  setShowMsg: (data: any) => void;
  setMsgText: (data: any) => void;
  setMsgClass: (data: any) => void;
}

export const Step4: React.FC<Step4Props> = ({
  onSuccess,
  onBack,
  setShowMsg,
  setMsgText,
  setMsgClass,
  earlyAccessRef
}) => {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const [contactDetails, setContactDetails] = React.useState<ContactDetails>({
    mobileNumber: "",
    countryCode: "",
    country: "",
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("early-access-data");

      if (!stored) {
        router.replace("/home_test");
        return;
      }
      const result = JSON.parse(stored);
      setCachedData(result);

      setContactDetails({
        mobileNumber: result.mobileNumber || "",
        countryCode: result.countryCode || "",
        country: result.country || "",
      });

      if (result.mobileNumber && result.countryCode) {
        setPhone(`+${result.countryCode}${result.mobileNumber}`);
      }
    } catch {
      router.replace("/home_test");
    }
  }, []);

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
            "early-access-data",
            JSON.stringify({
              ...cachedData,
              currentStep: "5",
              mobileNumber: contactDetails.mobileNumber,
              countryCode: contactDetails.countryCode,
              country: contactDetails.country,
              isMobileNumberVerified: false,
            })
          );
          if (onSuccess) onSuccess();
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
        "early-access-data",
        JSON.stringify({
          ...cachedData,
          currentStep: "6",
        })
      );
    }
  };

  const createMessage = (message: string, type: "error" | "success") => {
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
    const updatedData = {
      ...cachedData,
      currentStep: "3",
    };
    localStorage.setItem("early-access-data", JSON.stringify(updatedData));
    setCachedData(updatedData);

    if (onBack) onBack();
  };

  return (
    <>
      <div ref={earlyAccessRef} className="bg-[#09073A] p-10 my-10">
        <div className="lg:flex items-center justify-center">
          <EarlyAccessCircleVW />
            <div className="min-h-[29.875rem] lg:ml-[5rem] m-2  xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
            <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
              <BackArrowVW onClick={handleBackNavigation} />
              Request Early Access
            </h2>

            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-5 -tracking-[0.04em]">
              Step 4 of 8: Enter your name and email address.{" "}
              <span className="font-normal font-avenir">
                {" "}
                We’ll send a link to verify it’s really you.
              </span>
            </p>

            <form
              className="mt-5 text-[1rem] max-md:text-sm font-normal leading-[100%] "
              onSubmit={updateContactDetails}
            >
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
                  <span>You’ll get a verification link</span>
                </div>

                <button
                  type="submit"
                  className="steps_btn_submit mt-[10.438rem] text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
                >
                  {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
