const WithTelegramNoAccount = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          The Telegram account you’ve connected has not been activated in our
          Telegram Bot. Activate now to join the MMOSH.
        </p>
      </div>

      <div className="mt-8">
        <a
          className="bg-[#CD068E] py-4 px-4 rounded-md flex items-center"
          href="https://t.me/LiquidHeartsBot"
          target="_blank"
        >
          <p className="text-white text-lg">Activate Bot</p>
        </a>
      </div>
    </div>
  );
};

export default WithTelegramNoAccount;
