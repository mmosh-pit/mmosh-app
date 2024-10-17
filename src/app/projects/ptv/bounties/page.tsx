"use client";
import * as React from "react";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as ProjectConn } from "@/anchor/community";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";

const Page = () => {
    const navigate = useRouter();
    const connection = useConnection();
    const wallet = useAnchorWallet();
    const [profileInfo] = useAtom(userWeb3Info);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectDetail, setProjectDetail] = useState<any>(null)
    const [projectInfo, setProjectInfo] = useState<any>({
        profiles: [],
        activationTokens: [],
        activationTokenBalance: 0,
        totalChild: 0,
        profilelineage: {
            promoter: "",
            promoterprofile:"",
            scout: "",
            scoutprofile:"",
            recruiter: "",
            recruiterprofile: "",
            originator: "",
            originatorprofile: "",
        },
        generation: "",
        invitationPrice: 0,
        mintPrice: 0
    })

    const getProjectDetailFromAPI = async() => {
        try {
            setProjectLoading(true)
            let listResult = await axios.get(`/api/project/detail?symbol=PTV`);
            setProjectDetail(listResult.data)

            setProjectLoading(false)
        } catch (error) {
            setProjectLoading(false)
            setProjectDetail(null)
        }
    }


    const getUserProfileInfo = async () => {
        if(!wallet) {
            return
        }
        setProjectLoading(true)
        const env = new anchor.AnchorProvider(connection.connection, wallet, {
            preflightCommitment: "processed",
        });

        anchor.setProvider(env);
        let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectDetail.project.key));
        let projectInfo = await projectConn.getProjectUserInfo(projectDetail.project.key);

        let tokenInfo = await projectConn.metaplex.nfts().findByMint({
            mintAddress: new anchor.web3.PublicKey(projectDetail.project.key) 
        })
        setProjectInfo(projectInfo)
    }
    React.useEffect(()=>{
        getProjectDetailFromAPI()
     },[wallet])

    React.useEffect(()=>{
        if(projectDetail) {
            getUserProfileInfo()
        }
    },[projectDetail])

    React.useEffect(()=>{
        if(profileInfo) {
            if(projectInfo.profiles.length == 0) {
                navigate.push("/create/project/PTV/join");
            }
        }
    },[profileInfo])
  return (
    <div className="w-full min-h-screen flex flex-col items-center background-content px-12">

    </div>
  );
};

export default Page;
