// step7
export default function Step7VC() {
  return (
    <div className="font-avenir grid grid-cols-1 lg:grid-cols-2 lg:gap-x-9 max-lg:gap-y-8 items-center">
      <div className="flex flex-col gap-7.5">
        <h1 className="font-poppins text-[2.188rem] max-md:text-2xl font-bold leading-[110%] max-lg:text-center bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Join the CAT FAWN Connection <br className="max-md:hidden" />
          Early Access Circle
        </h1>

        <div className="text-base text-[#FFFFFFE5] leading-[130%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap">
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

      <div className="min-h-118 bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.313rem] ps-13 pe-[3.063rem] max-md:px-5 max-md:py-8">
        <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>

        <p className="text-base max-md:text-sm font-normal leading-[130%] mt-2.5 -tracking-[0.02em]">
          Step 7 of 7: You’re in. Welcome to CAT FAWN Early Access. You can
          start connecting with CAT FAWN today.
        </p>

        <div className="mt-2.5 text-base leading-[130%] font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap -tracking-[0.02em]">
          <p>You’ll receive updates when:</p>

          <ul className="list-disc-none">
            <li>• The mobile app becomes available</li>
            <li>• Early access circles or live sessions open</li>
            <li>• Public launch date is confirmed</li>
          </ul>
        </div>

        <form className="md:min-h-59 mt-5 text-base flex flex-col justify-between">
          <div>
            <label className="block mb-[0.313rem] font-normal leading-[100%]">
              Subscribe to the blog
            </label>
            <input
              type="text"
              placeholder="Subscribe to the blog"
              className="w-full h-[3.438rem] px-[1.294rem] py-4.5 rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
            />

            <p className="mt-[0.688rem] leading-[130%] -tracking-[0.02em]">
              Thank you for helping us bring fearlessness, self-authorship,
              sacred communication, and inner nature into the world through
              CAT-FAWN Connection.
            </p>
          </div>

          <button
            type="button"
            className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
          >
            Thanks!
          </button>
        </form>
      </div>
    </div>
  );
}