// step7
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step15VC() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

      <p className="text-[#FFFFFFE5] text-center text-[1rem] max-md:text-sm font-normal leading-[100%] mt-[0.688rem] -tracking-[0.02em]">
        You’re in. Welcome to CAT FAWN Early Access
      </p>

      <div className="text-[#FFFFFFE5] mt-[0.313rem] text-[1rem] leading-[100%] font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap -tracking-[0.02em]">
        <p>
          You can start connecting with CAT FAWN by email, text message,
          Telegram and BlueSky today. They’ll be sure to contact you by email as
          soon as:
        </p>

        <ul className="list-disc mt-[0.125rem] ml-5">
          <li> The mobile app becomes available</li>
          <li> We schedule small early access circles or live sessions</li>
          <li> The public launch date is set</li>
        </ul>

        <p className="mt-px leading-[130%]">
          In the meantime, please subscribe to our blog for occasional updates
          about Four Arrows’ work and the evolution of CAT-FAWN
          <br />
          Connection.
        </p>
      </div>

      <form className="mt-[0.313rem] text-[1rem]">
        <div>
          <label className="block mb-[0.313rem] text-[1rem] leading-[100%] text-[#FFFFFFCC]">
            Subscribe to the blog
          </label>

          <div className="flex gap-[0.625rem]">
            <input
              type="text"
              placeholder="Subscribe to the blog"
              className="w-full h-[3.438rem] px-[1.25rem] py-[1.125rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-40 text-[1rem]"
            />

            <button
              style={{ textWrap: "nowrap" }}
              className="w-[7.625rem] h-[3.438rem] pt-[1.25rem] pb-[1.063rem] px-[0.688rem] leading-[130%] -tracking-[0.02em] font-avenirNext font-semibold text-[0.875rem] rounded-[0.375rem] bg-[#FF710F] text-[#37191D]"
            >
              Subscribe Now
            </button>
          </div>

          <p className="mt-[0.313rem] text-[0.813rem] leading-[100%] -tracking-[0.02em]">
            Thank you for helping us bring fearlessness, self-authorship, sacred
            communication, and inner nature into the world through worldview
            reflection and trance-based
            <br /> learning.
          </p>
        </div>

        <button
          type="button"
          className="mt-[1.313rem] font-avenirNext h-[3.125rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
          onClick={() => {
          setIsLoading(true);

          // ✅ read existing data
          const stored = localStorage.getItem("catfawn-data");
          if (stored) {
            const parsed = JSON.parse(stored);

            // ✅ update step
            localStorage.setItem(
              "catfawn-data",
              JSON.stringify({
                ...parsed,
                currentStep: "catfawn/step16",
              })
            );
          }
          router.replace("/catfawn/step16")
        }
      }
        >
          Thanks!
        </button>
      </form>
    </div>
  );
}
