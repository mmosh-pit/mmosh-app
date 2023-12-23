import TwitterIcon from "@/assets/icons/TwitterIcon";

const ConnectedWOTwitter = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          Last step! To complete your registration please connect your Twitter
          (X) account to the Airdrop Bot.
        </p>
      </div>

      <div className="mt-8">
        <button className="bg-[#FCAE0E] py-16 px-4 rounded-md">
          <p className="text-black text-lg">
            <TwitterIcon /> Connect Twitter/X Account
          </p>
        </button>
      </div>
    </div>
  );
};

export default ConnectedWOTwitter;
