import Image from "next/image";
import * as React from "react";
import axios from "axios";

import { User } from "../models/user";
import TwitterDarkIcon from "@/assets/icons/TwitterDarkIcon";
import TelegramDarkIcon from "@/assets/icons/TelegramDarkIcon";

type Props = {
  user: User;
  isHome: boolean;
};

const UserCard = ({ user }: Props) => {
  const rendered = React.useRef(false);
  const [rank, setRank] = React.useState(0);

  const getRankData = React.useCallback(async () => {
    if (user.profilenft) {
      const result = await axios.get(
        `/api/get-member-rank?nft=${user.profilenft}`,
      );

      setRank(result.data.rank);
    } else {
      const result = await axios.get(
        `/api/get-rank-data?user=${user.telegram.id}`,
      );

      setRank(result.data.rank);
    }
  }, [user]);

  React.useEffect(() => {
    if (!rendered.current) {
      getRankData();
      rendered.current = true;
    }
  }, []);

  return (
    <div className="relative grid">
      <div
        className="flex bg-[#030007] bg-opacity-40 px-4 py-4 rounded-2xl"
        id={user.profilenft && "member-container-home"}
      >
        <div className="self-center max-w-[30%] mr-8">
          <div className="relative w-[8vmax] h-[8vmax]">
            <Image
              src={user.profile.image}
              alt="Profile Image"
              className="rounded-full"
              layout="fill"
            />
          </div>
        </div>

        <div className="w-full flex flex-col justify-start">
          <div>
            <p className="text-white text-lg">
              {user.profile.name} •{" "}
              <span className="text-gray-500">
                {user.profilenft ? "Member" : "Guest"}
              </span>
            </p>
            <p className="text-base">@{user.profile.username}</p>
          </div>

          <div className="my-4">
            <p className="text-white text-base">{user.profile.bio}</p>
            <a
              className="text-[#FF00C7] text-base"
              href={`https://mmosh.app/${user.profile.username}`}
            >
              mmosh.app/{user.profile.username}
            </a>
          </div>

          <div>
            <div className="flex items-center">
              <TelegramDarkIcon />

              <a
                target="_blank"
                href={`https://t.me/${user.telegram.username}`}
                className="ml-4 underline text-[#9493B2]"
              >
                https://t.me/{user.telegram.username}
              </a>
            </div>

            <div className="flex items-center mt-2">
              <TwitterDarkIcon />

              <a
                target="_blank"
                href={`https://twitter.com/${user.twitter.username}`}
                className="ml-4 underline text-[#9493B2]"
              >
                https://twitter.com/{user.twitter.username}
              </a>
            </div>
          </div>

          <div className="w-[100%] flex justify-between bg-[#434E59] bg-opacity-50 px-[1vmax] py-2 rounded-3xl mt-4">
            <div>
              <p className="text-white text-xs">
                Royalties: {user.royalty || 0}
              </p>
            </div>

            <div className="bg-[#596570] w-[1px] h-full mx-2" />

            <div>
              <p className="text-white text-xs">
                Seniority: {user.profile.seniority || 0}
              </p>
            </div>

            <div className="bg-[#596570] w-[1px] h-full mx-2" />

            <div>
              <p className="text-white text-xs">Rank: {rank}</p>
            </div>

            <div className="bg-[#596570] w-[1px] h-full mx-2" />

            <div>
              <p className="text-white text-xs">
                Points: {user.telegram.points || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
