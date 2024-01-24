const DesktopNavbar = () => {
  return (
    <div
      id="desktop-navbar"
      className="min-w-[15%] md:h-[90%] lg:h-[85%] px-8 py-16 flex flex-col rounded-2xl mr-12"
    >
      <p className="text-lg font-bold mb-8">My MMOSH Account</p>

      <div className="flex my-4">
        <p className="text-base text-white">Bags</p>
        <p className="text-base text-white mx-2">•</p>

        <p id="coming-soon" className="text-base">
          Coming Soon
        </p>
      </div>

      <div className="flex my-4">
        <p className="text-base text-white">Send</p>
        <p className="text-base text-white mx-2">•</p>

        <p id="coming-soon" className="text-base">
          Coming Soon
        </p>
      </div>

      <div className="flex my-4">
        <p className="text-base text-white">Swap</p>
        <p className="text-base text-white mx-2">•</p>

        <p id="coming-soon" className="text-base">
          Coming Soon
        </p>
      </div>

      <div className="flex my-4">
        <p className="text-base text-white">Create</p>
        <p className="text-base text-white mx-2">•</p>

        <p id="coming-soon" className="text-base">
          Coming Soon
        </p>
      </div>

      <div className="flex my-4">
        <p className="text-base text-white">Airdrop</p>
        <p className="text-base text-white mx-2">•</p>

        <p id="coming-soon" className="text-base">
          Coming Soon
        </p>
      </div>
    </div>
  );
};

export default DesktopNavbar;
