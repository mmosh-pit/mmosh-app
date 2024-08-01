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

const ProjectCard = ({
  image,
  price,
  coinSymbol,
  name,
  launchDate,
  symbol,
  description,
}: Props) => {
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

      <div className="flex w-[6vmax] absolute top-[10px] right-[5px] flex">
        <div className="self-end flex">
          <p className="text-white text-base mr-4">To Launch</p>
        </div>
      </div>

      <div className="absolute bottom-[5px] right-[5px] left-[5px] flex flex-col">
        <div className="flex flex-col bg-[#00000082] border-t-lg mb-2">
          <h6>{name}</h6>

          <div className="flex flex-col mt-8">
            <p className="text-white text-lg font-bold underline">{symbol}</p>
            <p className="text-xs">{description}</p>
          </div>
        </div>

        <div className="w-[6vmax] w-full flex">
          <div className="flex grow justify-center mr-[4px] bg-[#00000082] border-bl-lg py-3">
            <p className="text-white text-base">Unit Price</p>
          </div>
          <div className="flex grow justify-center ml-[4px] bg-[#00000082] border-br-lg py-3">
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
