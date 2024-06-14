import Image from "next/image";
import * as React from "react";

type Props = {
  image: string;
  name: string;
  username: string;
  description: string;
  coinImage?: string;
};

const CommunityCard = ({ image, name, description, coinImage }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[6vmax] h-[6vmax] md:w-[10vmax] md:h-[10vmax] my-2 home-community-card-image">
        <Image
          src={image}
          alt="community-image"
          layout="fill"
          className="rounded-lg"
        />

        {coinImage && (
          <img
            src={coinImage}
            alt="Coin"
            className="absolute left-[45%] top-[-15px] w-[1.5vmax] h-[1.5vmax] rounded-full"
          />
        )}
      </div>

      <div className="w-full flex flex-col">
        <p className="text-sm text-white">{name}</p>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
};

export default CommunityCard;
