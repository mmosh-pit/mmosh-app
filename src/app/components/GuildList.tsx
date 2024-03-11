import axios from "axios";
import * as React from "react";
import { User } from "../models/user";
import UserCard from "./UserCard";

const sortOptions = [
  { label: "Royalties", value: "royalty" },
  { label: "Seniority", value: "profile.seniority" },
  { label: "Points", value: "telegram.points" },
];

const GuildList = ({
  profilenft,
  isMyProfile,
  userName,
}: {
  profilenft: string;
  isMyProfile: boolean;
  userName: string;
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedSortOption, setSelectedSortOption] = React.useState("royalty");
  const [lineageOptions, setLineageOptions] = React.useState([
    { label: "Promoted", value: "gen1", selected: true, subLabel: "Gen 1" },
    { label: "Scouted", value: "gen2", selected: true, subLabel: "Gen 2" },
    { label: "Recruited", value: "gen3", selected: true, subLabel: "Gen 3" },
    { label: "Originated", value: "gen4", selected: true, subLabel: "Gen 4" },
  ]);

  const listInnerRef = React.useRef(null);
  const lastPageTriggered = React.useRef(false);

  const filterGuild = React.useCallback(async () => {
    if (!profilenft) return;
    const gensArr: string[] = [];

    lineageOptions.forEach((val) => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    });

    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&skip=${
        currentPage * 10
      }&sort=${selectedSortOption}&gens=${gensArr.join(",")}`,
    );

    if (result.data.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers(result.data);
  }, [selectedSortOption, currentPage]);

  const onScroll = React.useCallback(() => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (
        scrollTop + clientHeight === scrollHeight &&
        !lastPageTriggered.current
      ) {
        setCurrentPage(currentPage + 1);
      }
    }
  }, [currentPage]);

  const toggleChangeOption = React.useCallback(
    (field: string) => {
      const newValues = [...lineageOptions].map((val) => {
        if (val.value === field) {
          val.selected = !val.selected;
        }

        return { ...val };
      });

      setLineageOptions(newValues);
    },
    [lineageOptions],
  );

  React.useEffect(() => {
    filterGuild();
  }, [selectedSortOption, currentPage]);

  if (!profilenft || users.length === 0) return <></>;

  return (
    <>
      <div className="flex flex-col items-start ml-20 mt-8">
        <p className="text-lg text-white font-bold font-goudy">
          {isMyProfile ? "Your Guild" : `${userName}'s Guild`}
        </p>
        <div className="flex self-start mt-4">
          {lineageOptions.map((option) => (
            <div
              key={option.value}
              className="flex justify-center items-center mx-4 cursor-pointer relative"
              onClick={() => toggleChangeOption(option.value)}
            >
              <input
                type="radio"
                name={`radio-${option.value}`}
                className="radio"
                checked={option.selected}
                onChange={() => {}}
              />
              <p className="text-base text-white ml-4">
                {option.label}{" "}
                <span className="text-xs">({option.subLabel})</span>
              </p>
            </div>
          ))}
        </div>

        <div id="filter-container">
          {sortOptions.map((option) => (
            <div
              className={`px-4 ${
                option.value === selectedSortOption && "selected-sort-option"
              } cursor-pointer relative`}
              key={option.value}
              onClick={() => setSelectedSortOption(option.value)}
            >
              <p className="text-sm text-white">{option.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative px-16 pb-8 grid xs:grid-cols-auto lg:grid-cols-3 gap-4 mt-[3vmax]"
        onScroll={onScroll}
        ref={listInnerRef}
      >
        {users.map((value) => (
          <UserCard user={value} key={value.profile.username} />
        ))}
      </div>
    </>
  );
};

export default GuildList;
