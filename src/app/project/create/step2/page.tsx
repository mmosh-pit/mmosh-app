"use client";
import { userWeb3Info } from "@/app/store";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import Button from "@/app/components/common/Button";
import TickIcon from "@/assets/icons/TickIcon";

export default function ProjectCreateStep2() {
    const navigate = useRouter();

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [profileInfo] = useAtom(userWeb3Info);

    const [communities, setCommunities] = useState([])

    const [profiles, setProfiles] = useState([])
    
    const [profileLoading, setProfileLoading] = useState(true)
    const [profilePage, setProfilePage] = useState(1) 
    const [isProfilePaging, setIsProfilePaging] = useState(false)

    const [communityLoading, setCommunityLoading] = useState(false)
    const [communityPage, setCommunityPage] = useState(0) 
    const [isCommunityPaging, setIsCommunityPaging] = useState(false)
 
    const gotoStep3 = () => {
        let community = ""
        for (let index = 0; index < communities.length; index++) {
            const element:any = communities[index];
            if(element.selected == 1) {
                community = element.community;
            }
        }

        if (community == "") {
            createMessage("Community selection is required", "danger-container");
            return;
        }

        let selectedProfiles = [];

        for (let index = 0; index < profiles.length; index++) {
            const element:any = profiles[index];
            if(element.selected == 1) {
                selectedProfiles = element.wallet;
            }
        }

        localStorage.setItem("projectstep2",JSON.stringify({
            community,
            profiles: selectedProfiles
        }))

        navigate.push("/project/create/step3");
    }

    const goBack = () => {
        navigate.back()
    }

    useEffect(()=>{
        listProfile(1);
        listCommunity(1);
    },[])

    const listProfile = async(page:any) => {
        try {
            setProfileLoading(true)
            setIsProfilePaging(false)
            let url = '/api/get-all-users?sort=royalty&skip='+((page - 1) * 10)+'&userType=all';
            let apiResult = await axios.get(url);
      
            let newProfile:any = page == 1 ? [] : profiles;

            for (let index = 0; index < apiResult.data.users.length; index++) {
                const element:any = apiResult.data.users[index];
                newProfile.push({
                    wallet: element.wallet,
                    name: element.profile.username,
                    image: element.profile.image,
                    selected: 0
                });
            }
            setProfiles(newProfile);
            if(apiResult.data.users.length <10 ) {
               setIsProfilePaging(false)
            } else {
               setIsProfilePaging(true)
            }
            setProfileLoading(false)
        }  catch (error) {
            setProfileLoading(false)
            setProfiles([])
        }
    }

    const nextProfilePage = () => {
        let currentPage = profilePage + 1;
        setProfilePage(currentPage);
        listProfile(currentPage);
    }

    const onProfileSelect = (profileItem:any) => {

        let currentProfiles:any = profiles;
        let newProfiles:any = []
        for (let index = 0; index < currentProfiles.length; index++) {
            if(currentProfiles[index].wallet == profileItem.wallet) {
                currentProfiles[index].selected = currentProfiles[index].selected == 0 ? 1 : 0
            }
            newProfiles.push(currentProfiles[index])
        }
        console.log(newProfiles);
        setProfiles(newProfiles);
    }

    const listCommunity = async(page:any) => {
        try {
            setCommunityLoading(true)
            setIsCommunityPaging(false)
            let url = '/api/list-community?skip='+((page - 1) * 10);
            let apiResult = await axios.get(url);
      
            let newCommunity:any = page == 1 ? [] : communities;

            for (let index = 0; index < apiResult.data.community.length; index++) {
                const element:any = apiResult.data.community[index];
                    newCommunity.push({
                        title: element.name,
                        symbol: element.symbol,
                        image: element.passimg,
                        coinimg: element.coinimage,
                        token:element.token,
                        community:element.community,
                        selected: 0
                    });
            }
            setCommunities(newCommunity);
            if(apiResult.data.community.length <10 ) {
                setIsCommunityPaging(false)
            } else {
                setIsCommunityPaging(true)
            }
            setCommunityLoading(false)
        }  catch (error) {
            setCommunityLoading(false)
            setCommunities([])
        }
    }

    const nextCommunityPage = () => {
        let currentPage = communityPage + 1;
        setCommunityPage(currentPage);
        listCommunity(currentPage);
    }
    
    const onCommunitySelect = (communityItem:any) => {
        let currentCommunties:any = communities;
        let newCommunties:any = []
        for (let index = 0; index < currentCommunties.length; index++) {
            if(currentCommunties[index].community == communityItem.community) {
                currentCommunties[index].selected = 1
            } else {
                currentCommunties[index].selected = 0
            }
            newCommunties.push(currentCommunties[index])
        }
        setCommunities(newCommunties);
    }

    const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        if(type == "success-container") {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        } else {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        }
    
      };



    return (
        <>
            {showMsg && (
                <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
            )}
            <div className="relative background-content">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="relative w-full flex flex-col justify-center items-center pt-5">
                        <div className="max-w-md">
                            <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                            <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 2</h3>
                            <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Select Community and Profile</h3>
                            <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Each project will require a Project Founder to guide the  development, launch and ongoing operations of the Project and a supportive Community that will embrace and endorse the project. Both the Founder and Community may receive royalties from the Project.</p>
                        </div>
                    </div>
                </div>
                <div className="container py-14 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 backdrop-container rounded-xl p-5 border border-white border-opacity-20">
                        <div>
                            <div className="text-center pb-3">
                                <h3 className="text-header-small-font-size bg-purple inline-block px-5 py-1.5 font-poppins rounded-xl font-normal">Genesis Pass</h3>
                            </div>
                            <div className="pr-10 max-h-96 overflow-auto border-r border-white border-opacity-20">
                            {communityLoading &&
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
                                }
                                {!communityLoading && communities.length > 0 &&
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                        {communities.map((community:any) => (
                                            <div onClick={onCommunitySelect}>
                                                <div className="relative">
                                                    <img className="rounded-full object-cover w-full" src={community.image} alt="community image" />
                                                    {community.selected == 1 &&
                                                            <div className="bg-black bg-opacity-[0.56] w-full h-full rounded-full absolute left-0 top-0 flex justify-center items-center">
                                                            <div className="w-6 h-6">
                                                                <TickIcon />
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            
                                                <h6 className="text-xs text-white pt-1.5 pb-1.5">{community.title}</h6>
                                                <div className="flex">
                                                    <img src={community.coinimg} alt="coin image" className="w-5 h-5 object-cover rounded-full" />
                                                    <p className="text-xs text-white pl-1.5">{community.symbol}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }

                                {!communityLoading && communities.length == 0 &&
                                    <div className="mb-5 text-header-small-font-size text-center"> No community found </div>
                                }

                                {(isCommunityPaging && !communityLoading) &&
                                    <div className="flex justify-center">
                                        <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={nextCommunityPage}>Load More</button>
                                    </div>
                                } 
                            </div>
                        

                                {communities.map((community:any) => (
                                        <>
                                        {community.selected == 1 &&
                                            <div className="py-10 w-48 mx-auto">
                                                <p className="text-xs text-white">Community to Support the Project</p>
                                                <div className="flex">
                                                    <img src={community.coinimg} alt="coin image" className="w-5 h-5 object-cover rounded-full" />
                                                    <p className="text-xs text-white pl-1.5">{community.symbol}</p>
                                                </div>
                                            </div>
                                        }
                                        </>
                                    ))}
            
                        </div>
                        <div>
                        <div className="text-center pb-3">
                                <h3 className="text-header-small-font-size bg-purple inline-block px-5 py-1.5 font-poppins rounded-xl font-normal">Profile NFT</h3>
                            </div>
                            <div className="pl-10 max-h-96 overflow-auto">
                                {profileLoading &&
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
                                }
                                {!profileLoading && profiles.length > 0 &&
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                                        {profiles.map((profile:any) => (
                                            <>
                                                <div className="cursor-pointer" onClick={()=>{onProfileSelect(profile)}}>
                                                    <div className="relative">
                                                        <img className="rounded-full object-cover w-full" src={profile.image} alt="profile" />
                                                        {profile.selected == 1 &&
                                                            <div className="bg-black bg-opacity-[0.56] w-full h-full rounded-full absolute left-0 top-0 flex justify-center items-center">
                                                                <div className="w-6 h-6">
                                                                    <TickIcon />
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                
                                                    <h6 className="text-xs text-white pt-1.5 text-center">{profile.name}</h6>
                                                </div>
                                            </>
                                        
                                        ))}
                                    </div>
                                }

                                {!profileLoading && profiles.length == 0 &&
                                    <div className="mb-5 text-header-small-font-size text-center"> No profile found </div>
                                }

                                {(isProfilePaging && !profileLoading) &&
                                    <div className="flex justify-center">
                                        <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={nextProfilePage}>Load More</button>
                                    </div>
                                } 
        
                            </div>
                            {profileInfo &&
                                <div className="py-10 w-48 mx-auto">
                                    <p className="text-xs text-white">Profile of the Project Founder</p>
                                    <div className="flex">
                                        <img src={profileInfo.profile.image} alt="coin image" className="w-5 h-5 object-cover rounded-full" />
                                        <p className="text-xs text-white pl-1.5">{profileInfo.profile.name}</p>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                        {profileInfo &&
                        <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep3}>Next</button>
                        }

                    </div>
                </div>
            </div>
        </>

    );
}
