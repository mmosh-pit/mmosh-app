// step5
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function Step13VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  // six inputs stored individually
  const [kinshipCode, setKinshipCode] = React.useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [noCodeChecked, setNoCodeChecked] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);
    } catch {
      router.replace("/");
    }
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    const char = value.slice(-1);

    if (!/^[a-zA-Z0-9]?$/.test(char)) return;

    setKinshipCode((prev) => {
      const updated = [...prev];
      updated[index] = char.toUpperCase();
      return updated;
    });

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (kinshipCode[index]) {
        setKinshipCode((prev) => {
          const updated = [...prev];
          updated[index] = "";
          return updated;
        });
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setKinshipCode((prev) => {
          const updated = [...prev];
          updated[index - 1] = "";
          return updated;
        });
      }
    }
  };

  const submitKinshipCode = async () => {
    const code = kinshipCode.join("");
    if (noCodeChecked) {
      localStorage.setItem(
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          currentStep: "step6",
        })
      );

      return router.replace("/step6");
    }

    if (code.length !== 6) {
      // toast.error(
      //   "Please enter a valid 6-digit Kinship Code or check the box."
      // );
      return;
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "step6",
        referedKinshipCode: code,
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "step6",
          })
        );

        router.replace("/step6");
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
      <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[88%] mt-[0.313rem] -tracking-[0.04em]">
        Step 13 of 14: Kinship Code Verification.{" "}
        <span className="font-normal font-avenir">
          {" "}
          Entry into the CAT FAWN Connections happens through relationship,
          trust, and reciprocity. <br />A Kinship Code from an existing member
          signals that connection. <br />
          If you have one, enter it now.
        </span>
      </p>

      <form className="mt-[1.188rem] min-h-63.5 text-base max-md:text-sm font-normal">
        <div>
          <div>
            <label className="block text-[1rem] mb-[0.313rem] font-normal leading-[100%] text-[#FFFFFFCC]">
              Kinship Code{" "}
            </label>
            <input
              type="text"
              placeholder="Kinship Code"
              className="w-full h-[3.438rem] px-[1.25rem] py-[1.125rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-40 text-[1rem]"
            />
          </div>
          {/* {kinshipCode.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={noCodeChecked}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  onChange={(e) => handleCodeChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-14 h-[3.438rem] max-lg:w-14 max-lg:h-[3.438rem] max-sm:size-6 max-xl:size-6 p-5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none"
                />
              ))} */}

          <label className="flex items-center gap-0.5 text-[#FFFFFFE5] opacity-70 text-[0.813rem] max-md:text-xs leading-[140%] mt-[0.313rem] -tracking-[0.02em]">
            <input
              type="checkbox"
              className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
              checked={noCodeChecked}
              onChange={(e) => setNoCodeChecked(e.target.checked)}
            />
            I don’t have a code yet — I’ll provide one later.
          </label>
        </div>

        <button
          type="button"
          className="font-avenirNext h-[3.125rem] mt-[11rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
          onClick={submitKinshipCode}
        >
          Join Early Access
        </button>
      </form>
    </div>
  );
}
