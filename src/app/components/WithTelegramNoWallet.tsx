const WithTelegramNoWallet = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          The Telegram account you’ve connected has not activated our Airdrop
          Bot. Activate now to claim your Airdrops.
        </p>
      </div>

      <div className="mt-8">
        <button className="bg-[#FCAE0E] py-16 px-4 rounded-md">
          <p className="text-black text-lg">Activate Bot</p>
        </button>
      </div>
    </div>
  );
};

export default WithTelegramNoWallet;
