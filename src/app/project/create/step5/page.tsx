"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import AddIcon from "@/assets/icons/AddIcon";
import Calender from "@/assets/icons/Calender";
import MinusIcon from "@/assets/icons/MinusIcon";
import TimeIcon from "@/assets/icons/TimeIcon";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";

export default function ProjectCreateStep5() {
    const navigate = useRouter();

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [coinDetails, setCoinDetails] = useState({
        preview: "",
        name: "", 
        symbol: "",
        desc: "",
        supply: 0,
        listingPrice: 0,
    })

    const [presaleDetails, setPresaleDetails] = useState({
        presaleStartDate: "",
        presaleStartTime: "",
        presaleEndDate: "",
        presaleEndTime: "",
        dexListingDate: "",
        dexListingTime: "",
        maxPresale: 0,
        minPresale: 0
    })

    const [passes, setPasses] = useState([{
        preview: "",
        name:"",
        symbol:"",
        desc:"",
        price:0,
        supply: 0,
        tokens:0,
        listPrice:0,
        promoterRoyalty:0,
        scoutRoyalty:0,
        redemptionDate: "",
        redemptionTime: ""
    }]);


    React.useEffect(()=>{
        if(localStorage.getItem("projectstep3")) {
           let savedData:any = localStorage.getItem("projectstep3");
           setCoinDetails(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep4")) {
            let savedData:any = localStorage.getItem("projectstep4");
            setPresaleDetails(JSON.parse(savedData));
         }

        if(localStorage.getItem("projectstep5")) {
            let savedData:any = localStorage.getItem("projectstep5");
            setPasses(JSON.parse(savedData));
        }
    },[])

    const addPassAction = () => {
        let newPasses = [];
        for (let index = 0; index < passes.length; index++) {
            newPasses.push(passes[index]);
        }
        newPasses.push({
            preview: "",
            name:"",
            symbol:"",
            desc:"",
            price:0,
            supply: 0,
            tokens:0,
            listPrice:0,
            promoterRoyalty:0,
            scoutRoyalty:0,
            redemptionDate: "",
            redemptionTime: ""
        });
        setPasses(newPasses)
    }


    const removePassAction = (i:any) => {
        let newPasses = [];
        for (let index = 0; index < passes.length; index++) {
            if(i == index) {
                continue;
            }
            newPasses.push(passes[index]);
        }
        setPasses(newPasses)
    }

    const updatePassAction = (i:any, passItem:any) => {
        let newPasses = [];
        for (let index = 0; index < passes.length; index++) {
            if(i == index) {
                newPasses.push(passItem);
            } else {
                newPasses.push(passes[index]);
            }
        }
        setPasses(newPasses)
    }

    const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
    }

    const gotoStep6 = () => {
        if(validateFields()) {
            localStorage.setItem("projectstep5",JSON.stringify(passes));
            navigate.push("/project/create/step6");
        }
    }



     const goBack = () => {
        navigate.back()
     }

     const validateFields = () => {
        let totalTokens:any = 0;
        for (let index = 0; index < passes.length; index++) {
            const fields = passes[index];
            if (fields.preview.length == 0) {
                createMessage("Image is required", "danger-container");
                return false;
            }

              if (fields.name.length == 0) {
                createMessage("Name is required", "danger-container");
                return false;
              }
      
              if (fields.name.length > 50) {
                  createMessage("Name should have less than 50 characters", "danger-container");
                  return false;
              }
          
              if (fields.symbol.length == 0) {
                createMessage("Symbol is required", "danger-container");
                return false;
              }
      
              if (fields.symbol.length > 10) {
                  createMessage("Symbol should have less than 10 characters", "danger-container");
                  return false;
              }
          
              if (fields.desc.length == 0) {
                createMessage("Description is required", "danger-container");
                return false;
              }
      
              if (fields.desc.length > 160) {
                  createMessage("Description should have less than 160 characters", "danger-container");
                  return false;
              }

              if (fields.price == 0) {
                createMessage("Launch pass is required", "danger-container");
                return false;
              }

              if (fields.listPrice == 0) {
                createMessage("listing price is required", "danger-container");
                return false;
              }

              if (fields.supply == 0) {
                createMessage("Supply is required", "danger-container");
                return false;
              }
          
              if (fields.tokens == 0) {
                createMessage("Tokens supply is required", "danger-container");
                return false;
              }

              if ((fields.scoutRoyalty + fields.promoterRoyalty) > 100 ) {
                createMessage("Invalid royalty percentage", "danger-container");
                return false;
              }
          
              let dexDate = new Date(presaleDetails.dexListingDate + " "+presaleDetails.dexListingTime)
              let redemptionDate = new Date(fields.redemptionDate + " "+fields.redemptionTime)
              if(getDateDiff(dexDate,redemptionDate) < 0) {
                createMessage("Redemption date and time is invalid", "danger-container");
                return false;
              }
              totalTokens = totalTokens + fields.tokens;
        }

        if ((coinDetails.supply *  (presaleDetails.maxPresale / 100 )) < totalTokens) {
            createMessage("Total token allocated to launch pass is greator than presale allocation", "danger-container");
            return false;
        }
        return true;
    }

    const getDateDiff=(startDate:any, endDate:any)=> {
        if (endDate.getTime() - startDate.getTime() > 0) {
            var diff = endDate.getTime() - startDate.getTime();
            var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
            return diffDays
        } else {
            return -1;
        }
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
                            {coinDetails.supply *  (presaleDetails.maxPresale / 100 )} Tokens Allocated to Presale
                        </div>
                     
                    </div>
                </div>
                {passes.map((passItem:any, i) => (
                    <>
                        <div className="my-5">
                            <h3 className="flex">
                                {i > 0 &&
                                    <div className="cursor-pointer" onClick={()=>{removePassAction(i)}}>
                                        <MinusIcon />
                                    </div>
                                
                                }
                                <span className={i > 0 ? "text-sub-title-font-size text-while font-poppins p-1.5" : "text-sub-title-font-size text-while font-poppins"}>Launchpass {i+1}</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                            <div className="col-span-3">
                                <ImagePicker changeImage={(image:any)=>{
                                   const objectUrl = URL.createObjectURL(image);
                                   passItem.preview = objectUrl;
                                   updatePassAction(i,passItem);
                                }} image={passItem.preview} />
                            </div>
                            <div className="col-span-3">
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Name"
                                        required
                                        helperText=""
                                        placeholder="Name"
                                        value={passItem.name}
                                        onChange={(e) => {passItem.name = e.target.value; updatePassAction(i, passItem)}}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Symbol"
                                        required
                                        helperText=""
                                        placeholder="Symbol"
                                        value={passItem.symbol}
                                        onChange={(e) => {passItem.symbol = e.target.value; updatePassAction(i, passItem)}}
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
                                        value={passItem.desc}
                                        onChange={(e) => {passItem.desc = e.target.value; updatePassAction(i, passItem)}}
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
                                                value={(passItem.price > 0 ? passItem.price.toString() : "")}
                                                onChange={(e) => {passItem.price = prepareNumber(Number(e.target.value)); updatePassAction(i, passItem) }}
                                            />
                                        </div>
                                        <div className="form-element pt-2.5">
                                            <Input
                                                type="text"
                                                title="Supply of Launchpasses"
                                                required
                                                helperText=""
                                                placeholder="Supply of Launchpasses"
                                                value={(passItem.supply > 0 ? passItem.supply.toString() : "")}
                                                onChange={(e) => {passItem.supply = prepareNumber(Number(e.target.value)); updatePassAction(i, passItem) }}
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
                                                value={(passItem.tokens > 0 ? passItem.tokens.toString() : "")}
                                                onChange={(e) => {passItem.tokens = prepareNumber(Number(e.target.value)); updatePassAction(i, passItem) }}
                                            />
                                        </div>
                                        <div className="form-element pt-2.5">
                                            <Input
                                                type="text"
                                                title="Listing Price"
                                                required
                                                helperText=""
                                                placeholder="Listing Price"
                                                value={(passItem.listPrice > 0 ? passItem.listPrice.toString() : "")}
                                                onChange={(e) => {passItem.listPrice = prepareNumber(Number(e.target.value)); updatePassAction(i, passItem) }}
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
                                            value={(passItem.promoterRoyalty > 0 ? passItem.promoterRoyalty.toString() : "")}
                                            onChange={(e) => {passItem.promoterRoyalty = prepareNumber(Number(e.target.value)); updatePassAction(i, passItem) }}
                                        />
                                    </div>
                                    <div className="form-element pt-2.5">
                                        <Input
                                            type="text"
                                            title="Royalties to Scout"
                                            required
                                            helperText=""
                                            placeholder="%"
                                            value={(passItem.scoutRoyalty > 0 ? passItem.scoutRoyalty.toString() : "")}
                                            onChange={(e) => {passItem.scoutRoyalty = prepareNumber(Number(e.target.value)); updatePassAction(i, passItem) }}
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
                                    
                                            <input type="date" className="grow" placeholder="Date" value={passItem.redemptionDate} onChange={(e) =>{passItem.redemptionDate = e.target.value; updatePassAction(i, passItem)}} />
                                            </label>
                                        </div>
                                        <div className="form-element">
                                            <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                            <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
                                                <TimeIcon />
                                            </div>
                                    
                                            <input type="time" className="grow" placeholder="Time" value={passItem.redemptionTime} onChange={(e) =>{passItem.redemptionTime = e.target.value; updatePassAction(i, passItem)}} />
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
      
                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Number of Tokens Distributed upon Redemption of Launchpass</p>
                                <p className="text-xs text-white text-center">{passItem.supply * passItem.tokens}</p>
                              </div>

                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Total Value of Launchpass at DEX Listing Price</p>
                                <p className="text-xs text-white text-center">{(passItem.supply * passItem.tokens) * coinDetails.listingPrice}</p>
                              </div>

                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Number of Tokens Distributed at Redemption.</p>
                                <p className="text-xs text-white text-center">{passItem.tokens}</p>
                              </div>

                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Redemption Price per Token in Launchpass</p>
                                <p className="text-xs text-white text-center">{passItem.price}</p>
                              </div>
           
                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Total Royalties to Community and Founder from each Launchpass</p>
                                <p className="text-xs text-white text-center">{ passItem.price * ((passItem.promoterRoyalty + passItem.scoutRoyalty) / 100)}</p>
                              </div>

                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Royalties to Project Founder from each Launchpass</p>
                                <p className="text-xs text-white text-center">{ passItem.price * (passItem.promoterRoyalty / 100)}</p>
                              </div>

                              <div>
                                <p className="text-xs text-whilte mb-2.5 text-center">Royalties to Community from each Launchpass</p>
                                <p className="text-xs text-white text-center">{ passItem.price * (passItem.scoutRoyalty / 100)}</p>
                              </div>


                        </div>
                    </>

                ))}

                <div className="my-5">
                        <h3 className="flex">
                            <div className="cursor-pointer" onClick={()=>{addPassAction()}}>
                                <AddIcon />
                            </div>
                            <span className="text-sub-title-font-size text-while font-poppins p-1.5">Launchpass {passes.length+1}</span></h3>
                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep6}>Next</button>
                </div>
            </div>
           </div>
        </>

    );
}
