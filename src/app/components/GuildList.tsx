import axios from "axios";
import * as React from "react";
import { User } from "../models/user";
import UserCard from "./UserCard";

const sortOptions = [
  { label: "Royalties", value: "royalty" },
  { label: "Seniority", value: "profile.seniority" },
  { label: "Points", value: "telegram.points" },
];

const gensOptions = [
  { label: "Promoted", value: "gen1", selected: true },
  { label: "Scouted", value: "gen2", selected: true },
  { label: "Recruited", value: "gen3", selected: true },
  { label: "Originated", value: "gen4", selected: true },
];

const GuildList = ({ profilenft }: { profilenft: string }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedSortOption, setSelectedSortOption] = React.useState("royalty");
  const [lineageOptions, setLineageOptions] = React.useState(gensOptions);

  const listInnerRef = React.useRef(null);
  const lastPageTriggered = React.useRef(false);

  const getGuildData = React.useCallback(async () => {
    if (!profilenft) return;

    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&gens=gen1,gen2,gen3,gen4&skip=${
        currentPage * 10
      }&sort=royalty`,
    );

    setUsers(result.data);
  }, [profilenft]);

  const filterGuild = React.useCallback(async () => {
    const gensArr: string[] = [];

    lineageOptions.forEach(val => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    })

    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&skip=${
        currentPage * 10
      }&sort=${selectedSortOption}&gens=${gensArr.join(",")}`,
    );

    if (result.data.users.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers(result.data.users);
  }, [selectedSortOption, currentPage]);

  const onScroll = React.useCallback(() => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (
        scrollTop + clientHeight === scrollHeight && !lastPageTriggered.current
      ) {
        setCurrentPage(currentPage + 1);
      }
    }
  }, [currentPage]);

  const toggleChangeOption = React.useCallback(
    (checked: boolean, field: string) => {
      setLineageOptions((prev) => {
        const newValues = [...prev.map((val) => {
          if (val.value === field) {
            val.selected = checked;
          }

          return val;
        })];

        return newValues;
      });
    },
    [lineageOptions],
  );

  React.useEffect(() => {
    filterGuild();
  }, [selectedSortOption, currentPage]);

  React.useEffect(() => {
    getGuildData();
  }, [profilenft]);

  if (!profilenft || users.length === 0) return <></>;

  return (
    <>
      <div className="flex flex-col items-start ml-20">
        <div className="flex self-start bg-[#020028] rounded-2xl">
          {lineageOptions.map((option) => (
            <div className="flex">
              <input
                type="radio"
                name="radio-1"
                className="radio"
                checked={option.selected}
                onChange={(e) =>
                  toggleChangeOption(e.target.checked, option.value)}
              />
              <p className="text-base text-white ml-4">{option.label}</p>
            </div>
          ))}
        </div>

        <div id="filter-container">
          {sortOptions.map((option) => (
            <div
              className={`px-2 ${
                option.value === selectedSortOption &&
                "selected-sort-option rounded-xl"
              } relative cursor-pointer`}
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
