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
      `/api/get-user-ranking?user=${userData!.telegram.id}`,
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
      <div>
        <h3>Airdrop Status</h3>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p>
          <span className="font-bold">Total Members:</span>{" "}
          {airdropStatus.totalMembers}
        </p>
        <p>
          <span className="font-bold">Total Points:</span>{" "}
          {airdropStatus.totalPoints}
        </p>
        <p>
          <span className="font-bold">Your Points:</span> {airdropStatus.points}
        </p>
        <p>
          <span className="font-bold">Your Odds:</span> {airdropStatus.odds}
        </p>
        <p>
          <span className="font-bold">Your Rank:</span> {airdropStatus.rank}
        </p>
      </div>

      <div>
        <p>
          Congratulations! You’re fully enrolled in our Airdrops. Return to our
          Airdrop Bot for additional tasks to earn points, win Airdrop Keys and
          claim your Airdrops.
        </p>
      </div>
    </div>
  );
};

export default UserAirdropStatus;
