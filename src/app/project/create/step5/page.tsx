"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import AddIcon from "@/assets/icons/AddIcon";
import Calender from "@/assets/icons/Calender";
import MinusIcon from "@/assets/icons/MinusIcon";
import TimeIcon from "@/assets/icons/TimeIcon";
import React, { use, useState } from "react";

export default function ProjectCreateStep5() {
    const [image, setImage] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState("");
    const [passes, setPasses] = useState(1);
    const [results, setResults] = useState([{
        name: "Number of Tokens Distributed upon Redemption of Launchpass ",
        value: "--"
    },{
        name: "Total Value of Launchpass at DEX Listing Price",
        value: "--"
    },{
        name: "Number of Tokens Distributed at Redemption.",
        value: "--"
    },{
        name: "Redemption Price per Token in Launchpass",
        value: "--"
    },{
        name: "Total Royalties to Community and Founder from each Launchpass",
        value: "--"
    },{
        name: "Royalties to Project Founder from each Launchpass",
        value: "--"
    },{
        name: "Royalties to Community from each Launchpass",
        value: "--"
    }
    ])

    React.useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);
    }, [image]);

     const passAction = (type:any) => {
       if(type === "add") {
          setPasses(passes + 1);
       } else {
          if(passes > 1) {
            setPasses(passes - 1);
          }
       }
     }


     const gotoStep6 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 4</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Set Presale Royalties, Discounts and Redemption Date</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Build demand for your Community Coin with a powerful token presale and automate your DEX listings.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="flex justify-end mb-3.5">
                    <div className="text-xs text-white border-container p-px rounded">
                        <div className="bg-theme-blue py-2 px-3.5 rounded">
                            123 Tokens Allocated to Presale
                        </div>
                     
                    </div>
                </div>
                {Array.from(Array(passes), (e, i) => (
                    <>
                        <div className="my-5">
                            <h3 className="flex">
                                {i > 0 &&
                                <div className="cursor-pointer" onClick={()=>{passAction("remove")}}>
                                    <MinusIcon />
                                </div>
                                
                                }
                                <span className={i > 0 ? "text-sub-title-font-size text-while font-poppins p-1.5" : "text-sub-title-font-size text-while font-poppins"}>Launchpass {i+1}</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                            <div className="col-span-3">
                                <ImagePicker changeImage={setImage} image={preview} />
                            </div>
                            <div className="col-span-3">
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Name"
                                        required
                                        helperText=""
                                        placeholder="Name"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Symbol"
                                        required
                                        helperText=""
                                        placeholder="Symbol"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <Input
                                        textarea
                                        type="text"
                                        title="Description"
                                        required
                                        helperText=""
                                        placeholder="Describe your Community Coin and associated project and protocol."
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                            </div>
                            <div className="col-span-4">
                                <div className="grid grid-cols-2 gap-4">
                                        <div className="form-element pt-2.5">
                                            <Input
                                                type="text"
                                                title="Price of Launchpass"
                                                required
                                                helperText=""
                                                placeholder="Price of Launchpass"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                        </div>
                                        <div className="form-element pt-2.5">
                                            <Input
                                                type="text"
                                                title="Supply of Launchpasses"
                                                required
                                                helperText=""
                                                placeholder="Supply of Launchpasses"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                        </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                        <div className="form-element pt-2.5">
                                            <Input
                                                type="text"
                                                title="Discount of Tokens to initial DEX Listing Price"
                                                required
                                                helperText=""
                                                placeholder="Discount of Tokens to DEX"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                        </div>
                                        <div className="form-element pt-2.5">
                                            <Input
                                                type="text"
                                                title="Listing Price"
                                                required
                                                helperText=""
                                                placeholder="Listing Price"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                        </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-element pt-2.5">
                                        <Input
                                            type="text"
                                            title="Royalties to Promoter"
                                            required
                                            helperText=""
                                            placeholder="%"
                                            value={""}
                                            onChange={(e) => {}}
                                        />
                                    </div>
                                    <div className="form-element pt-2.5">
                                        <Input
                                            type="text"
                                            title="Royalties to Scout"
                                            required
                                            helperText=""
                                            placeholder="%"
                                            value={""}
                                            onChange={(e) => {}}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2.5">
                                    <p className="text-xs text-white">Redemption Date and Time*</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-element">
                                            <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                            <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
                                                <Calender />
                                            </div>
                                    
                                            <input type="text" className="grow" placeholder="Date" />
                                            </label>
                                        </div>
                                        <div className="form-element">
                                            <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                            <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
                                                <TimeIcon />
                                            </div>
                                    
                                            <input type="text" className="grow" placeholder="Time" />
                                            </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <h3 className="text-sub-title-font-size text-while font-poppins my-5 text-center">
                            Result
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                           {results.map((resultItem: any, index: any) => (
                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">{resultItem.name}</p>
                                <p className="text-xs text-white md:text-left text-center">{resultItem.value}</p>
                              </div>
                           ))}
                        </div>
                    </>

                ))}

                <div className="my-5">
                        <h3 className="flex">
                            <div className="cursor-pointer" onClick={()=>{passAction("add")}}>
                                <AddIcon />
                            </div>
                            <span className="text-sub-title-font-size text-while font-poppins p-1.5">Launchpass {passes+1}</span></h3>
                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep6}>Next</button>
                </div>
            </div>
        </div>
    );
}
