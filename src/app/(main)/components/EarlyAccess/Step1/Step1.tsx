import React from "react";

export const Step1: React.FC = () => {
  return (
    <div className="bg-[#09073A] py-10 my-10">
      <div className="flex my-5 mx-auto items-center lg:w-[80rem] justify-between">
        <div>
          <h3 className="  transition duration-300 sm:text-left text-[2.25rem] font-poppinsNew font-bold leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
            Join the Kinship Intelligence
          </h3>
          <p className="text-justify  text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
            Be among the first to use Kinship Intelligence to change <br />{" "}
            yourself, change your life, and change the world.
          </p>
          <p className="text-justify  text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
            As an early access member, you’ll:
          </p>
          <ul className="text-[#FFFFFFE5] text-base  font-avenir list-disc  ml-5">
            <li>Experience the app before public launch</li>
            <li>Share insights that will shape the product</li>
            <li>
              Join live sessions + private groups with Four Arrows & Kinship
            </li>
          </ul>
        </div>
        <div>
          <div className="min-h-[29.875rem] ml-[5rem] xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
            <h3 className="  transition duration-300 text-[1.95rem] text-center font-poppinsNew font-bold  tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              Request Early Access
            </h3>
            <p className="text-[#FFFFFFE5] text-base  my-2">
              {" "}
              <span className="text-white font-bold text-base">
                Step 1 of 8: Enter your name and email address.
              </span>{" "}
              We’ll send a <br />
              link to verify it’s really you.
            </p>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Firstname*</legend>
              <input
                type="text"
                className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                placeholder="First Name"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29] "
                placeholder="Email"
              />
            </fieldset>
            <label className="label">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
              />
              <span className="ml-5">
                {" "}
                By continuing, I agree to receive communications about the
                Kinship Bots early access program and launch updates.
              </span>
            </label>
            <button className="btn bg-[#EB8000] hover:bg-[#EB8000] w-full text-white font-bold mt-[2rem] border-[#FF710F33] hover:border-none">
              Sends the security verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
