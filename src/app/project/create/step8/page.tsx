"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import Select from "@/app/components/common/Select";
import AddIcon from "@/assets/icons/AddIcon";
import Calender from "@/assets/icons/Calender";
import TimeIcon from "@/assets/icons/TimeIcon";
import React, { useState } from "react";

export default function ProjectCreateStep8() {


     const gotoStep9 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 8</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Set Liquidity Pool</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Allocate USDC, SOL and MMOSH for the initial liquidity pools at launch. A minimum of 500 USDC is required for listing by name and symbol on the DEXs. We will provide matching funds for all pools and promote your project with a minimum of $300 in MMOSH. A supply of your Community Coin equal in value to the trading pair will be required for each liquidity pool.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-12">
                   <div className="col-start-4 col-span-6">
                        <div className="backdrop-container rounded-xl py-5 px-10 border border-white border-opacity-20 mb-10 ">
                            <h3 className="text-sub-title-font-size text-while font-poppins text-center pb-10">Liquidity</h3>
                            <p className="text-header-small-font-size text-center pb-10">Set the value of the liquidity pools in USD for each trading pair, with a minimum of $100 each.</p>

                            <div className="flex justify-center mb-5">

                                <div className="w-24 mr-3.5">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder="0"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <p className="text-para-font-size text-white leading-10 min-w-14">in USDC</p>
                            </div>

                            <div className="flex justify-center mb-5">
                                <div className="w-24 mr-3.5">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder="0"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <p className="text-para-font-size text-white leading-10 min-w-14">in SOL</p>
                            </div>

                            <div className="flex justify-center mb-5">
                                <div className="w-24 mr-3.5">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder="0"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <p className="text-para-font-size text-white leading-10 min-w-14">in MMOSH</p>
                            </div>
  
                        </div>
                   </div>

                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep9}>Next</button>
                </div>
            </div>
        </div>
    );
}
