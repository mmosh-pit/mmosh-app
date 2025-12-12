"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
// import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    firstName: "",
    email: "",
    hasChecked: false,
  });
  const [errors, setErrors] = React.useState({});
  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("warn-container");
  const [msgText, setMsgText] = React.useState("Hello World");

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) return;

    const result = JSON.parse(stored);

    if (result?.currentStep) {
      router.replace(`/${result.currentStep}`);
    }
  }, []);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.hasChecked) {
      newErrors.checkbox = "You must agree before submitting";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createVisitorRecord = async () => {
    if (!validateForm()) return;

    try {
      const result = await axios.post("/api/visitors", formData);
      if (result.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({ currentStep: "step2", email: formData.email })
        );
        router.replace("/step2");
      } else {
        // toast.error(result.data.message || "Something went wrong");
      }
    } catch (err: any) {
      // toast.error(
      //   err?.response?.data?.message ||
      //     "Unable to create visitor. Please try again."
      // );
    }
  };

  return (
    <>
      {showMsg && (
        <div>
          <MessageBanner
            type="error"
            message="Your membership is expired. pls upgrade"
          />
        </div>
      )}
      <div className="min-h-135.5 xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] ps-[3.25em] pe-[3.063em] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          {/* <div className="absolute left-0">
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
          </div> */}
          Request Early Access
        </h2>

        <p className="text-[1rem] font-avenirNext max-md:text-sm font-bold leading-[130%] mt-[0.313rem]">
          Step 1 of 14: Enter your name and email address.{" "}
          <span className="text-[#FFFFFFE5] font-normal fonnt-avenir">
            {" "}
            We’ll send a link to verify it’s really you.
          </span>
        </p>

        <form className="mt-[0.625rem] text-[1rem] max-md:text-sm font-normal">
          <div className="flex flex-col gap-[0.313rem]">
            <div>
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                First Name*
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(event) =>
                  setFormData({ ...formData, firstName: event.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                Email address
              </label>
              <input
                type="email"
                placeholder="Email address"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
                Password
              </label>
              <input
                type="email"
                placeholder="Password"
                className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
              />
            </div>
          </div>
          <button
            type="button"
            className="font-avenirNext h-[3.125rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90 cursor-pointer mt-[1.688rem]"
            onClick={createVisitorRecord}
          >
            Join Early Access
          </button>
          <label className="flex items-start gap-0.5  mt-1">
            <input
              type="checkbox"
              className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem] me-0.5"
              checked={formData.hasChecked}
              onChange={(event) =>
                setFormData({ ...formData, hasChecked: event.target.checked })
              }
            />
            <span className="text-[0.813rem] font-normal max-md:text-xs leading-[140%] -tracking-[0.02em]">
              I agree to receive communications about the CAT-FAWN Connection
              early access program and launch updates.
            </span>
          </label>

          <p className="text-center text-[0.813rem] text-white font-normal leading-[100%] underline cursor-pointer mt-[0.313rem]">
            Privacy Policy
          </p>
        </form>
      </div>
    </>
  );
}
