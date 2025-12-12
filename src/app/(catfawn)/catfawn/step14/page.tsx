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
    <div className="min-h-118 xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.313rem] ps-13 pe-[3.063rem] max-md:px-5 max-md:py-8">
      <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
        Request Early Access
      </h2>

      <p className="text-base max-md:text-sm font-normal leading-[130%] mt-[0.313rem] -tracking-[0.02em]">
        Step 6 of 7: Create Your Own Kinship Code. This will be the code you’ll
        share with others.
      </p>

      <form className="mt-[0.938rem] min-h-[21.188rem] max-lg:min-h-[322px] text-base max-md:text-sm font-normal flex flex-col justify-between">
        <div>
          <label className="block mb-[0.313rem] font-normal leading-[100%]">
            Kinship Code
          </label>

          <input
            type="text"
            placeholder="Kinship Code"
            value={kinshipCode}
            onChange={(e) => setKinshipCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-full h-[3.438rem] px-[1.294rem] py-4.5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
          />
        </div>

        <button
          type="button"
          onClick={submitNewKinshipCode}
          className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
        >
          Join Early Access
        </button>
      </form>
    </div>
  );
}
