import Image from "next/image";

type Props = {
  image: string;
  name: string;
  symbol: string;
  description: string;
  price: string;
  coinSymbol: string;
  launchDate: Date;
};

const ProjectCard = ({ image, price, coinSymbol }: Props) => {
  return (
    <div className="relative">
      <div className="w-[6vmax] h-[6vmax] md:w-[10vmax] md:h-[10vmax] my-2 home-community-card-image">
        <Image
          src={image}
          alt="community-image"
          layout="fill"
          className="rounded-lg"
        />
      </div>

      <div className="absolute top-[10px] right-[5px] flex"></div>

      <div className="absolute bottom-[5px] right-[5px] left-[5px] flex flex-col">
        <div className="bg-[#00000082] border-t-lg"></div>

        <div className="flex">
          <div className="bg-[#00000082] border-bl-lg py-3">
            <p className="text-white text-base">Unit Price</p>
          </div>
          <div className="bg-[#00000082] border-br-lg py-3">
            <p className="text-white text-base">
              {price}
              <span className="font-bold">{coinSymbol}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
