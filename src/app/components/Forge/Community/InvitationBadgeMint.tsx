import { Coin } from "@/app/models/coin";
import Image from "next/image";

type Props = {
  image: string;
  price: string;
  coin: Coin;
};

const InvitationBadgeMint = ({ image }: Props) => {
  return (
    <div className="community-page-container-card px-6 py-4">
      <h5>Invitation Badges</h5>

      <div className="w-[6vmax] h-[6vmax] relative">
        <Image src={image} alt="Invitation" layout="fill" />
      </div>

      <div className="w-full flex flex-col mt-4"></div>
    </div>
  );
};

export default InvitationBadgeMint;
