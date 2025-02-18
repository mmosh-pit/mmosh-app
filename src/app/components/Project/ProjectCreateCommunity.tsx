"use client";
import { userWeb3Info } from "@/app/store";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import TickIcon from "@/assets/icons/TickIcon";
import Select from "@/app/components/common/Select";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#180E4F",
  },
};

export default function ProjectCreateCommunity({ onPageChange, symbol }: { onPageChange: any, symbol:any }) {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const [communities, setCommunities] = useState([]);
  const [communityPage, setCommunityPage] = useState(1);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [isCommunityPaging, setIsCommunityPaging] = useState(false);

  const [projectDetail, setProjectDetail] =  React.useState<any>(null)

  const onSubmit = async () => {
    if(!projectDetail) {
      createMessage("project details not found", "error-container");
      return;
    }
    setLoading(true);
    for (let index = 0; index < communities.length; index++) {
      const element: any = communities[index];
      if (element.selected == 1) {
        await axios.post("/api/project/save-community", {
          name: element.title,
          communitykey: element.community,
          projectkey: projectDetail.project.key,
        });
      }
    }
    navigate.push("/projects/" + symbol);
  };

  useEffect(() => {
    getProjectDetailFromAPI()
    listCommunity(1);
  }, []);

  const getProjectDetailFromAPI = async() => {
    try {
        setLoading(true)
        let listResult = await axios.get(`/api/project/detail?symbol=${symbol}`);
        setProjectDetail(listResult.data)
        setLoading(false)
    } catch (error) {
        setLoading(false)
        setProjectDetail(null)
    }
  } 


  const listCommunity = async (page: any) => {
    try {
      setCommunityLoading(true);
      setIsCommunityPaging(false);
      let url = "/api/list-community?skip=" + (page - 1) * 10;
      let apiResult = await axios.get(url);

      let newCommunity: any = page == 1 ? [] : communities;

      for (let index = 0; index < apiResult.data.community.length; index++) {
        const element: any = apiResult.data.community[index];
        newCommunity.push({
          title: element.data.name,
          symbol: element.data.symbol,
          image: element.data.image,
          coinimg: element.data.coinImage,
          token: element.data.tokenAddress,
          community: element.data.project,
          selected: 0,
        });
      }
      setCommunities(newCommunity);
      if (apiResult.data.community.length < 10) {
        setIsCommunityPaging(false);
      } else {
        setIsCommunityPaging(true);
      }
      setCommunityLoading(false);
    } catch (error) {
      setCommunityLoading(false);
      setCommunities([]);
    }
  };

  const nextCommunityPage = () => {
    let currentPage = communityPage + 1;
    setCommunityPage(currentPage);
    listCommunity(currentPage);
  };

  const onCommunitySelect = (communityItem: any) => {
    console.log("communityItem", communityItem);
    let currentCommunties: any = communities;
    let newCommunties: any = [];
    for (let index = 0; index < currentCommunties.length; index++) {
      if (currentCommunties[index].community == communityItem.community) {
        currentCommunties[index].selected =
          currentCommunties[index].selected == 0 ? 1 : 0;
      }
      newCommunties.push(currentCommunties[index]);
    }
    setCommunities(newCommunties);
  };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    if (type == "success-container") {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    } else {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    }
    setLoading(false);
  };


  return (
    <>
      {showMsg && (
        <div
          className={
            "message-container text-white text-center text-header-small-font-size py-5 px-3.5 " +
            msgClass
          }
        >
          {msgText}
        </div>
      )}
      <div className="background-content">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-full flex flex-col justify-center items-center pb-5">
            <div className="max-w-md">
            <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">
                Select Communities
              </h3>
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="backdrop-container rounded-xl p-5 border border-white border-opacity-20">

            <div
              className="grid grid-cols-1"
            >
              <div>

                <div className="max-h-96 overflow-auto">
                  {communityLoading && (
                    <div className="flex justify-center">
                      <Bars
                        height="80"
                        width="80"
                        color="rgba(255, 0, 199, 1)"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass="bars-loading"
                        visible={true}
                      />
                    </div>
                  )}
                  {!communityLoading && communities.length > 0 && (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                      {communities.map((community: any) => (
                        <div
                          onClick={() => {
                            onCommunitySelect(community);
                          }}
                          className="rounded-md community-selection-container overflow-hidden cursor-pointer "
                          key={community.community}
                        >
                          <div className="relative">
                            <img
                              className="object-cover w-full aspect-square"
                              src={community.image}
                              alt="community image"
                            />
                            {community.selected == 1 && (
                              <div className="bg-black bg-opacity-[0.56] w-full h-full absolute left-0 top-0 flex justify-center items-center">
                                <div className="w-6 h-6">
                                  <TickIcon />
                                </div>
                              </div>
                            )}
                          </div>
                          <h6 className="text-para-font-size text-white pt-1.5 pb-1.5 px-2.5 capitalize">
                            {community.title} .{" "}
                            <span className="text-small-font-size uppercase">
                              {community.symbol}
                            </span>
                          </h6>
                        </div>
                      ))}
                    </div>
                  )}

                  {!communityLoading && communities.length == 0 && (
                    <div className="mb-5 text-header-small-font-size text-center">
                      {" "}
                      No community found{" "}
                    </div>
                  )}

                  {isCommunityPaging && !communityLoading && (
                    <div className="flex justify-center">
                      <button
                        className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                        onClick={nextCommunityPage}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            {!loading && (
              <button
                className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white"
                onClick={onSubmit}
              >
                Save
              </button>
            )}
            {loading && (
              <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">
                Loading...
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
