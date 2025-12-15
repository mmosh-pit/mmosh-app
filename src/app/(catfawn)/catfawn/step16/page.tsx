import React from "react";

const Step16VC = () => {
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

      <p className="text-[#FFFFFFE5] text-[1rem] max-md:text-sm font-normal leading-[100%] mt-[0.313rem] -tracking-[0.02em]">
        Step x of 15: Your Contact Details.{" "}
      </p>

      <form className="mt-[0.625rem] text-[1rem] max-md:text-sm font-normal">
        <div className="flex flex-col gap-[0.313rem]">
          <label className="block text-[0.813rem] text-[#FFFFFFCC] mb-[0.125rem] leading-[100%]">
            Avatar selection
          </label>
          <label
            htmlFor="avatar-input"
            className="w-[7.5rem] h-[5.938rem] rounded-xl bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] flex items-center justify-center cursor-pointer hover:bg-[#362226] transition mb-[0.313rem]"
          ></label>

          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
          />
          <div>
            <label className="block text-[0.813rem] text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
              Last Name{" "}
            </label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20 placeholder:font-normal text-[1rem]"
            />
          </div>

          <div>
            <label className="block text-[0.813rem] text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
              Bio
            </label>
            <input
              type="text"
              placeholder="Bio"
              className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20 placeholder:font-normal text-[1rem]"
            />
          </div>

          <div>
            <label className="block text-[0.813rem] text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
              Web Link{" "}
            </label>
            <input
              type="text"
              placeholder="http://myweb.com"
              className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20 placeholder:font-normal text-[1rem]"
            />
          </div>
        </div>
        <button
          type="button"
          className="font-avenirNext h-[3.125rem] flex justify-center items-end gap-2 w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90 cursor-pointer mt-[1.063rem]"
        >
          Next{" "}
        </button>
      </form>
    </div>
  );
};

export default Step16VC;
