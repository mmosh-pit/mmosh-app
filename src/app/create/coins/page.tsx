import CoinsTable from "../components/CoinDirectory/CoinsTable";
import Price from "../components/CoinDirectory/Price";
import SearchBar from "../components/CoinDirectory/SearchBar";
import TVL from "../components/CoinDirectory/TVL";
import Volume from "../components/CoinDirectory/Volume";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";

const Coins = () => {
  const isMobile = useCheckMobileScreen();

  return (
    <div className="w-full flex flex-col">
      {!isMobile && (
        <div className="w-full flex justify-around items-center">
          <TVL />

          <Volume />

          <Price />
        </div>
      )}

      <div className="mt-8">
        <SearchBar />
      </div>

      <div className="mt-8">
        <CoinsTable />
      </div>
    </div>
  );
};

export default Coins;
