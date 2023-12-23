import TelegramIcon from "../../assets/icons/TelegramIcon";

const ConnectedWOAccount = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          Thanks for connecting your wallet! Now let’s link your Telegram
          account to your Solana address.
        </p>
      </div>

      <div className="mt-8">
        <button className="bg-[#FCAE0E] py-16 px-4 rounded-md">
          <p className="text-black text-lg">
            <TelegramIcon /> Connect Telegram Account
          </p>
        </button>
      </div>
    </div>
  );
};

export default ConnectedWOAccount;
