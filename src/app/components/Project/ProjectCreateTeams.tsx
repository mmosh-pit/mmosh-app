"use client";
import { userWeb3Info } from "@/app/store";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import Button from "@/app/components/common/Button";
import TickIcon from "@/assets/icons/TickIcon";
import Select from "@/app/components/common/Select";
import Modal from "react-modal";
import CloseIcon from "@/assets/icons/CloseIcon";

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

export default function ProjectCreateTeams({ onPageChange, symbol }: { onPageChange: any, symbol:any }) {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const [roles, setRoles] = useState<any>([
    { label: "Investor", value: "Investor" },
    { label: "Creator", value: "Creator" },
    { label: "Builder", value: "Builder" },
    { label: "Advisor", value: "Advisor" },
    { label: "Sponsor", value: "Sponsor" },
    { label: "Moderator", value: "Moderator" },
    { label: "Other", value: "Other" },
  ]);

  const [profiles, setProfiles] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profilePage, setProfilePage] = useState(1);
  const [isProfilePaging, setIsProfilePaging] = useState(false);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [otherRole, setOtherRole] = useState("");

  const [projectDetail, setProjectDetail] =  React.useState<any>(null)


  const onSubmit = async () => {
    if(!projectDetail) {
        createMessage("project details not found", "error-container");
        return;
    }
    setLoading(true);

    for (let index = 0; index < profiles.length; index++) {
      const element: any = profiles[index];
      if (element.selected == 1) {
        await axios.post("/api/project/save-profile", {
            name: element.name,
            profilekey: element.profilenft,
            role: element.role,
            projectkey: projectDetail.project.key,
          });
      }
    }
    navigate.push("/projects/" + symbol);
  };

  useEffect(() => {
    getProjectDetailFromAPI()
    listProfile(1);
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

  const listProfile = async (page: any) => {
    try {
      setProfileLoading(true);
      setIsProfilePaging(false);
      let url =
        "/api/get-all-users?sort=royalty&skip=" +
        (page - 1) * 10 +
        "&userType=all";
      let apiResult = await axios.get(url);

      let newProfile: any = page == 1 ? [] : profiles;

      for (let index = 0; index < apiResult.data.users.length; index++) {
        const element: any = apiResult.data.users[index];
        newProfile.push({
          profilenft: element.profilenft,
          wallet: element.wallet,
          name: element.profile.username,
          image: element.profile.image,
          selected: 0,
          role: "Investor",
        });
      }
      setProfiles(newProfile);
      if (apiResult.data.users.length < 10) {
        setIsProfilePaging(false);
      } else {
        setIsProfilePaging(true);
      }
      setProfileLoading(false);
    } catch (error) {
      setProfileLoading(false);
      setProfiles([]);
    }
  };

  const nextProfilePage = () => {
    let currentPage = profilePage + 1;
    setProfilePage(currentPage);
    listProfile(currentPage);
  };

  const onProfileSelect = (profileItem: any) => {
    let currentProfiles: any = profiles;
    let newProfiles: any = [];
    for (let index = 0; index < currentProfiles.length; index++) {
      if (currentProfiles[index].wallet == profileItem.wallet) {
        currentProfiles[index].selected =
          currentProfiles[index].selected == 0 ? 1 : 0;
      }
      newProfiles.push(currentProfiles[index]);
    }
    console.log(newProfiles);
    setProfiles(newProfiles);
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

  const onProfileRoleUpdate = (profileItem: any, role: any) => {
    if (role == "Other") {
      setIsOpen(true);
      setCurrentProfile(profileItem);
      return;
    }
    let currentProfiles: any = profiles;
    let newProfiles: any = [];
    for (let index = 0; index < currentProfiles.length; index++) {
      if (currentProfiles[index].wallet == profileItem.wallet) {
        currentProfiles[index].role = role;
      }
      newProfiles.push(currentProfiles[index]);
    }
    setProfiles(newProfiles);
  };

  const includeNewRoleAction = (profileItem: any, role: any) => {
    setIsOpen(false);
    let currentRoles: any = roles;
    currentRoles.splice(-1);
    currentRoles.push({
      label: role,
      value: role,
    });
    currentRoles.push({ label: "Other", value: "Other" });
    setRoles(currentRoles);

    let currentProfiles: any = profiles;
    let newProfiles: any = [];
    for (let index = 0; index < currentProfiles.length; index++) {
      if (currentProfiles[index].wallet == profileItem.wallet) {
        currentProfiles[index].role = role;
      }
      newProfiles.push(currentProfiles[index]);
    }
    setProfiles(newProfiles);
  };


  const closeModal = () => {
    setIsOpen(false);
    if (currentProfile != null) {
      let currentProfiles: any = profiles;
      let newProfiles: any = [];
      for (let index = 0; index < currentProfiles.length; index++) {
        if (currentProfiles[index].wallet == currentProfile.wallet) {
          currentProfiles[index].role = currentProfile.role;
        }
        newProfiles.push(currentProfiles[index]);
      }
      setProfiles(newProfiles);
    }
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
                Select Team
              </h3>
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="backdrop-container rounded-xl p-5 border border-white border-opacity-20">

            <div
              className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
            >
              <div>


                <div className="lg:pl-10 xl:pl-10 max-h-96 overflow-auto">
                  {profileLoading && (
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
                  {!profileLoading && profiles.length > 0 && (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                      {profiles.map((profile: any) => (
                        <>
                          <div className="cursor-pointer">
                            <div
                              className="relative"
                              onClick={() => {
                                onProfileSelect(profile);
                              }}
                            >
                              <img
                                className="rounded-full object-cover w-full aspect-square"
                                src={profile.image}
                                alt="profile"
                              />
                              {profile.selected == 1 && (
                                <div className="bg-black bg-opacity-[0.56] w-full h-full rounded-full absolute left-0 top-0 flex justify-center items-center">
                                  <div className="w-6 h-6">
                                    <TickIcon />
                                  </div>
                                </div>
                              )}
                            </div>

                            <h6 className="text-xs text-white pt-1.5 text-center">
                              {profile.name}
                            </h6>
                            <div
                              className={
                                profile.selected == 1
                                  ? "visible pt-1.5"
                                  : "invisible pt-1.5"
                              }
                            >
                              <Select
                                value={profile.role}
                                onChange={(e) =>
                                  onProfileRoleUpdate(profile, e.target.value)
                                }
                                options={roles}
                              />
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  )}

                  {!profileLoading && profiles.length == 0 && (
                    <div className="mb-5 text-header-small-font-size text-center">
                      {" "}
                      No profile found{" "}
                    </div>
                  )}

                  {isProfilePaging && !profileLoading && (
                    <div className="flex justify-center">
                      <button
                        className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                        onClick={nextProfilePage}
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

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <h2 className="mb-2.5">Add Role </h2>
          <input
            type="text"
            placeholder="Add Role"
            className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-80 mb-2.5"
            onChange={(e) => setOtherRole(e.target.value)}
            maxLength={50}
          />
          <div>
            <button
              type="submit"
              className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
              onClick={() => {
                includeNewRoleAction(currentProfile, otherRole);
              }}
            >
              Submit
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-2.5 bg-primary text-white border-none hover:bg-primary hover:text-white"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
