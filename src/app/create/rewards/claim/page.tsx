"use client"

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair } from "@solana/web3.js";
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { useRouter } from "next/navigation";

const ClaimPage = () => {
  const navigate = useRouter();
  const wallet = useAnchorWallet();
  const [countDownDate, setCountDownDate] = useState(0);
  const [countDown, setCountDown] = useState(0);

  const [redDetails, setRedDetails] = useState({
    total: 0,
    staked: 0,
    claimed: 0,
    unclaimed: 0,
    available: 0,
    claimable: 0,
    unstakeable: 0,
    user: {
      swapped: 0,
      unstaked: 0,
      total: 0
    }
  })

  const [blueDetails, setBlueDetails] = useState({
    total: 0,
    staked: 0,
    claimed: 0,
    unclaimed: 0,
    available: 0,
    claimable: 0,
    unstakeable: 0,
    user: {
      swapped: 0,
      unstaked: 0,
      total: 0
    }
  })


  useEffect(() => {
    if(countDownDate == 0) {
        return
    }
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  useEffect(()=>{
      getTokenData(process.env.NEXT_PUBLIC_PTVB_TOKEN)
      getTokenData(process.env.NEXT_PUBLIC_PTVR_TOKEN)
  },[wallet])

  const getTokenData = async (tokenAddress: any) => {
    try {
      if(!wallet) {
        return
      }
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);
  
      const env = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });
      const userConn = new UserConn(env, web3Consts.programID);

      const stakePublicKey = process.env.NEXT_PUBLIC_PTV_WALLET_KEY!;

      let ptvOwner = new anchor.web3.PublicKey(stakePublicKey)
  
      let supplyData = await userConn.connection.getTokenSupply(new anchor.web3.PublicKey(tokenAddress))
      console.log("tokenaddress ", tokenAddress)
      let overallSupply = await userConn.getUserBalance({
        token: tokenAddress,
        address: ptvOwner,
        decimals: web3Consts.LAMPORTS_PER_OPOS
      })

      let blueData = await axios("/api/ptv/rewards?type=Blue&&wallet="+wallet.publicKey.toBase58())
      let redData = await axios("/api/ptv/rewards?type=Red&&wallet="+wallet.publicKey.toBase58())

      if(tokenAddress === process.env.NEXT_PUBLIC_PTVB_TOKEN) {
        setBlueDetails({
          total: supplyData.value.uiAmount ? supplyData.value.uiAmount : 0,
          staked: overallSupply ? overallSupply : 0,
          claimed: blueData.data.totalclaim,
          unclaimed: blueData.data.totalunclaimed,
          available: (overallSupply ? overallSupply : 0) - blueData.data.totalavailable,
          unstakeable: blueData.data.unstakable,
          claimable: blueData.data.claimable,
          user: {
            swapped: blueData.data.swapped,
            unstaked: blueData.data.unstaked,
            total: blueData.data.total
          }
        })
      } else {
        setRedDetails({
          total: supplyData.value.uiAmount ? supplyData.value.uiAmount : 0,
          staked: overallSupply ? overallSupply : 0,
          claimed: redData.data.totalclaim,
          unclaimed: redData.data.totalunclaimed,
          available: (overallSupply ? overallSupply : 0) - redData.data.totalavailable,
          unstakeable: redData.data.unstakable,
          claimable: redData.data.claimable,
          user: {
            swapped: redData.data.swapped,
            unstaked: redData.data.unstaked,
            total: redData.data.total
          }
        })
      }


    } catch (error) {
      console.log("tokendata error ", error)
    }

  }

  const getCountDownValues = (countDown:any) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  
    return {days, hours, minutes, seconds};
  };

  useEffect(()=>{
    let claimDate = new Date("2024/11/05")
    setCountDownDate(claimDate.getTime())
  },[])


    return (
      <div className="mt-10">
        <h2 className="text-center text-white font-goudy font-normal text-xl">
            Claim Token
        </h2>
        <div className="max-w-3xl mx-auto ">
            <div className="border-container p-px rounded-xl">
                <div className="background-content-claim p-3.5 rounded-xl">
                     <div className="grid grid-cols-2">
                        <div className="border-r border-white border-opacity-20">
                          <h3 className="text-center text-white text-sub-title-font-size border-b border-white border-opacity-20 pb-3.5 mb-3.5">PTVB</h3>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Total Supply:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.total}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Staked:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.staked}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Claimed:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.claimed}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">UnClaimed:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.unclaimed}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Available:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.available}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-center text-white text-sub-title-font-size border-b border-white border-opacity-20 pb-3.5 mb-3.5">PTVR</h3>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Total Supply:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.total}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Staked:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.staked}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Claimed:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.claimed}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">UnClaimed:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.unclaimed}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-20">Available:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.available}</span>
                          </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
        <p className="text-para-font-size light-gray-color text-center para-line-height mb-5 mt-1 text-light-gray leading-4">Congratulations! You've earned the Pump The Tokens. Claim them here:</p>
        <div className="max-w-3xl mx-auto mb-5">
            <div className="grid grid-cols-2">
              <div>
                <div className="text-center">
                  <div className="bg-black bg-opacity-[0.2] text-header-small-font-size text-white font-poppins py-2.5 px-10 inline-block font-semibold mb-2.5">{blueDetails.claimable} PTVB</div>
                  <div>
                    <button className="btn-sm bg-primary text-white border-none hover:bg-primary hover:text-white w-32 rounded-md" onClick={()=>{navigate.push(`/create/swap`);}}>Claim PTVB</button>
                  </div>

                </div>

              </div>
              <div>
                <div className="text-center">
                  <div className="bg-black bg-opacity-[0.2] text-header-small-font-size text-white font-poppins py-2.5 px-10 inline-block font-semibold mb-2.5">{redDetails.claimable} PTVR</div>
                  <div>
                    <button className="btn-sm bg-primary text-white border-none hover:bg-primary hover:text-white w-32 rounded-md" onClick={()=>{navigate.push(`/create/swap`);}}>Claim PTVR</button>
                  </div>
                </div>

              </div>
            </div>
        </div>
        <p className="max-w-3xl mx-auto text-para-font-size light-gray-color text-center para-line-height mb-1.5 mt-1 text-light-gray leading-4 px-10"> keep sharing your blink in Bio to earn more rewards! These staked tokens can only be traded on the MMOSH until <strong>November 5th, 2024 at 11:59:59 PT</strong>  Return here to unstake your tokens and trade them freely. Staked tokens must be traded with memecoins on the MMOSH at least once before they are unstaked Countdown to all polls chlosed and results are in</p>
        <div className="leader-container max-w-sm mx-auto p-2.5 mb-5">
          <div className="flex justify-center">
                <div>
                    <div className="w-16 font-goudy text-xl text-center text-white flex justify-center align-center items-center">
                        {getCountDownValues(countDown).days}
                    </div>
                    <p className="text-header-small-font-size text-center">days</p>
                </div>
                <div>
                        <div className="w-16 font-goudy text-xl text-center text-white flex justify-center align-center items-center">
                        {getCountDownValues(countDown).hours}
                    </div>
                    <p className="text-header-small-font-size text-center">Hours</p>
                </div>
                <div>
                        <div className="w-16 font-goudy text-xl text-center text-white flex justify-center align-center items-center">
                        {getCountDownValues(countDown).minutes}
                    </div>
                    <p className="text-header-small-font-size text-center">Minutes</p>
                </div>
                <div>
                        <div className="w-16 font-goudy text-xl text-center text-white rounded-md flex justify-center align-center items-center">
                        {getCountDownValues(countDown).seconds}
                    </div>
                    <p className="text-header-small-font-size text-center">Seconds</p>
                </div>
            </div>
        </div>
        <h3 className="text-center text-white text-sub-title-font-size mb-3.5">UnStake Your Tokens</h3>
        <div className="max-w-3xl mx-auto ">
            <div className="border-container p-px rounded-xl">
                <div className="background-content-claim p-3.5 rounded-xl">
                     <div className="grid grid-cols-2">
                        <div className="border-r border-white border-opacity-20">
                          <h3 className="text-center text-white text-sub-title-font-size border-b border-white border-opacity-20 pb-3.5 mb-3.5">PTVB</h3>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Hold in Wallet:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.user.total}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Staked:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.unstakeable}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">UnStaked:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.user.unstaked}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Seasoned:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.claimable}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Swapped:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{blueDetails.user.swapped}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-center text-white text-sub-title-font-size border-b border-white border-opacity-20 pb-3.5 mb-3.5">PTVR</h3>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Hold in Wallet:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.user.total}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Staked:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.unstakeable}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">UnStaked:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.user.unstaked}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Seasoned:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.claimable}</span>
                          </div>
                          <div className="flex justify-center mt-1.5">
                              <label className="text-header-small-font-size text-white font-poppins font-semibold leading-6 w-24">Swapped:</label>
                              <span className="text-header-small-font-size text-white font-poppins leading-6">{redDetails.user.swapped}</span>
                          </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
        <div className="max-w-3xl mx-auto mt-5 pb-10">
            <div className="grid grid-cols-2">
              <div>
                <div className="text-center">
                  <div className="bg-black bg-opacity-[0.2] text-header-small-font-size text-white font-poppins py-2.5 px-10 inline-block font-semibold mb-2.5">{blueDetails.unstakeable} PTVB</div>
                  <div>
                    <button className="btn-sm bg-claim-color text-white border-none hover:bg-claim-color hover:text-white w-32 rounded-md">Unstake PTVB</button>
                  </div>

                </div>

              </div>
              <div>
                <div className="text-center">
                  <div className="bg-black bg-opacity-[0.2] text-header-small-font-size text-white font-poppins py-2.5 px-10 inline-block font-semibold mb-2.5">{blueDetails.unstakeable} PTVR</div>
                  <div>
                    <button className="btn-sm bg-claim-color text-white border-none hover:bg-claim-color hover:text-white w-32 rounded-md">Unstake PTVR</button>
                  </div>
                </div>

              </div>
            </div>
        </div>
      </div>
    )
}

export default ClaimPage