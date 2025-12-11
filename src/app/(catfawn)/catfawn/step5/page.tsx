// step5
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function Step5VC() {
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

      <div className="min-h-[25.313rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-8.5 ps-12.5 pe-[3.313rem] max-md:px-5 max-md:py-8">
        <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>
        <p className="text-base max-md:text-sm font-normal leading-[130%] mt-2.5  -tracking-[0.02em]">
          Step 5 of 7: Kinship Code Verification. Enter your Kinship Code if you
          have one.
        </p>

        <form className="mt-[0.938rem] min-h-63.5 text-base max-md:text-sm font-normal flex flex-col justify-between">
          <div className="max-lg:text-center">
            <label className="block mb-[0.313rem] font-normal leading-[100%]">
              Kinship Code (input field){" "}
            </label>

            <div className="flex gap-7 max-xl:gap-4 max-lg:justify-center">
              {kinshipCode.map((digit, i) => (
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
              ))}
            </div>

            <label className="flex items-center gap-0.5 text-[0.813rem] max-md:text-xs leading-[140%] mt-2.5 -tracking-[0.02em]">
              <input
                type="checkbox"
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
                checked={noCodeChecked}
                onChange={(e) => setNoCodeChecked(e.target.checked)}
              />
              I don’t have a code yet — I’ll provide one later.
            </label>
          </div>

          <button
            type="button"
            className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
            onClick={submitKinshipCode}
          >
            Join Early Access
          </button>
        </form>
      </div>
    </div>
  );
}