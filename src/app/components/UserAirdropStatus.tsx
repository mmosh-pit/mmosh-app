import { useAtom } from "jotai";
import * as React from "react";
import axios from "axios";
import { data } from "../store";

const formatNumber = (value: number) => {
  const units = ["", "K", "M", "B", "T"];

  let absValue = Math.abs(value);

  let exponent = 0;
  while (absValue > 1000 && exponent < units.length - 1) {
    absValue /= 1000;
    exponent++;
  }

  const formattedNumber = absValue.toFixed(2);

  return `${formattedNumber}${units[exponent]}`;
};

const UserAirdropStatus = () => {
  const [airdropStatus, setAirdropStatus] = React.useState({
    rank: 0,
    points: 0,
    totalPoints: "0",
    odds: "0",
    totalMembers: 0,
  });
  const [userData] = useAtom(data);

  const getRankData = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-rank-data?user=${userData!.telegram.id}`,
    );

    const rank = result.data.yourRank;
    const totalPoints = result.data.totalPoints;
    const formattedPoints = formatNumber(result.data.totalPoints);

    const userPoints = result.data.userPoints;
    const userOdds = (userPoints * 100) / totalPoints;

    const [_, userOddsDecimals] = userOdds.toString().split(".");

    let resultingOdds = userOdds.toString();

    if (userOddsDecimals) {
      if (userOddsDecimals.length > 6) {
        resultingOdds = userOdds.toFixed(6);
      }
    }

    setAirdropStatus({
      rank,
      points: userPoints,
      totalPoints: formattedPoints,
      odds: resultingOdds,
      totalMembers: result.data.totalUsers,
    });
  }, []);

  React.useEffect(() => {
    if (userData) getRankData();
  }, [userData]);

  return (
    <div className="w-full h-ull flex flex-col justify-center items-center">
      <div className="mb-12 mt-20">
        <h3>Airdrop Status</h3>
      </div>

      <div className="flex flex-col md:w-[20%] xs:w-[40%]">
        <div className="my-1 flex justify-between">
          <p className="font-bold text-white">Total Members:</p>{" "}
          <p>{airdropStatus.totalMembers}</p>
        </div>
        <div className="my-1 flex justify-between">
          <p className="font-bold text-white">Total Points:</p>{" "}
          <p>{airdropStatus.totalPoints}</p>
        </div>

        <div className="my-1 flex justify-between">
          <p className="font-bold text-white">Your Points:</p>
          <p className="my-1">{airdropStatus.points}</p>
        </div>
        <div className="my-1 flex justify-between">
          <p className="font-bold text-white">Your Odds:</p>
          <p className="my-1">{`${airdropStatus.odds}%`}</p>
        </div>
        <div className="my-1 flex justify-between">
          <p className="font-bold text-white">Your Rank:</p>
          <p className="my-1">{airdropStatus.rank}</p>
        </div>
      </div>

      <div className="mt-20 lg:max-w-[45%] md:max-w-[50%] xs:max-w-[80%]">
        <p className="text-center text-white">
          Congratulations! You’re fully enrolled in our Airdrops. Return to our
          Airdrop Bot for additional tasks to earn points, win Airdrop Keys and
          claim your Airdrops.
        </p>
      </div>
    </div>
  );
};

export default UserAirdropStatus;
