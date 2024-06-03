import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../../common/Button";

const CoinCard = () => {
  const navigate = useRouter();

  const navigateToCoin = () => {
    navigate.push("/coins");
  };

  return (
    <div className="flex">
      <div className="relative w-[12vmax] h-[10vmax] ml-2 mr-4">
        <Image
          src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_box.jpeg"
          alt="Invitation"
          layout="fill"
        />
      </div>

      <div className="w-full flex flex-col justify-between">
        <div className="w-full flex flex-col mt-2 mb-4">
          <p className="text-lg text-white">Create a New Coin</p>
          <p className="text-sm">
            With your own Coin, you can build community to launch and scale your
            own community. Get started now!
          </p>
        </div>

        <div className="w-full flex justify-around">
          <Button
            isLoading={false}
            title="Coin Directory"
            isPrimary={false}
            size="small"
            action={navigateToCoin}
          />

          <Button
            isLoading={false}
            title="Create a Coin!"
            isPrimary
            size="small"
            action={navigateToCoin}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
