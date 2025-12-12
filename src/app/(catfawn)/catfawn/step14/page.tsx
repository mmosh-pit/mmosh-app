// step6
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function Step14VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [kinshipCode, setKinshipCode] = React.useState("");

  const generateDefaultCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result.currentStep !== "step6") {
        router.replace(`/${result.currentStep}`);
        return;
      }

      const randomCode = generateDefaultCode();
      setKinshipCode(randomCode);
    } catch {
      router.replace("/");
    }
  }, [router]);

  const submitNewKinshipCode = async () => {
    const code = kinshipCode.trim().toUpperCase();

    if (!/^[A-Z0-9]+$/.test(code)) {
      // toast.error("Kinship Code must contain only letters and numbers.");
      return;
    }

    // Must be exactly 6 characters
    if (code.length !== 6) {
      // toast.error("Kinship Code must be exactly 6 characters.");
      return;
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "step7",
        kinshipCode: code,
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({ ...cachedData, currentStep: "step7" })
        );

        router.replace("/step7");
      } else {
        // toast.error(res.data.message);
      }
    } catch (err) {
      // toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] px-[3.125rem] max-md:px-5 max-md:py-8">
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
        Step 14 of 14: Create Your Own Kinship Code.
        <span className="font-normal font-avenir">
          Every person in the Kinship ecosystem carries a unique code — a way of
          extending relationship, trust, and reciprocity. Pick something
          meaningful, memorable, or fun — whatever seems true to you. This will
          be the code you’ll share with people you invite.
        </span>
      </p>

      <form className="mt-[0.875rem] min-h-63.5 text-base max-md:text-sm font-normal">
        <div>
          <label className="block text-[1rem] mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
            Set your Kinship Code{" "}
          </label>
          <input
            type="text"
            value={kinshipCode}
            onChange={(e) => setKinshipCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="Set your Kinship Code"
            className="w-full h-[3.438rem] px-[1.25rem] py-[1.125rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-40 text-[1rem]"
          />
        </div>

        <button
          type="button"
          className="font-avenirNext h-[3.125rem] mt-[11.813rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
          onClick={submitNewKinshipCode}
        >
          Join Early Access
        </button>
      </form>
    </div>
  );
}
