const WithTelegramNoAccount = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          The Telegram account you’ve connected has not activated our Airdrop
          Bot. Activate now to claim your Airdrops.
        </p>
      </div>

      <div className="mt-8">
        <a
          className="bg-[#FCAE0E] py-4 px-4 rounded-md flex items-center"
          href="https://t.me/LiquidHeartsBot"
          target="_blank"
        >
          <p className="text-black text-lg">Activate Bot</p>
        </a>
      </div>
    </div>
  );
};

export default WithTelegramNoAccount;
