"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProjectCreateStep3() {
    
    const navigate = useRouter();
    const [fields, setFields] = useState({
        image: {
            preview: "",
            type: ""
        },
        name: "", 
        symbol: "",
        desc: "",
        supply: 0,
        listingPrice: 0,
    })
    const [loading, setLoading] = useState(false)

    const [image, setImage] = React.useState<File | null>(null);

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    React.useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        let imageObj = {
            preview: objectUrl,
            type: image.type
        }
        setFields({ ...fields, image: imageObj })
    }, [image]);
    
    React.useEffect(()=>{
        if(localStorage.getItem("projectstep3")) {
          let savedData:any = localStorage.getItem("projectstep3");
          setFields(JSON.parse(savedData));
        }
      },[])

    const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        setLoading(false);
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

    const validateFields = () => {
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
    
        if(fields.image.preview.length == 0) {
            createMessage("Community coin image is required", "danger-container");
            return false;
        }

        return true;
    };

    const gotoStep4 = () => {
        setLoading(true);
        if(validateFields()) {
            localStorage.setItem("projectstep3",JSON.stringify(fields));
            navigate.push("/create/project/create/step4");
        }
    }

    const goBack = () => {
        navigate.back()
    }

    const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
    }

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
                            <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 3</h3>
                            <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Design Your Community Coin</h3>
                            <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">The design of your Community Coin should reflect the culture of your community and the power of your project.</p>
                        </div>
                    </div>
                </div>
                <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                            <ImagePicker changeImage={setImage} image={fields.image.preview} />
                            </div>
                            <div>
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Name"
                                        required
                                        helperText=""
                                        placeholder="Name"
                                        value={fields.name}
                                        onChange={(e) => setFields({ ...fields, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Symbol"
                                        required
                                        helperText=""
                                        placeholder="Symbol"
                                        value={fields.symbol}
                                        onChange={(e) => setFields({ ...fields, symbol: e.target.value })}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="form-element col-span-5">
                                            <Input
                                                type="text"
                                                title="Supply"
                                                required
                                                helperText=""
                                                placeholder="Supply"
                                                value={(fields.supply > 0 ? fields.supply.toString() : "")}
                                                onChange={(e) => setFields({ ...fields, supply: prepareNumber(Number(e.target.value))})}
                                            />
                                        </div>
                                        <div className="form-element col-span-5">
                                            <Input
                                                type="text"
                                                title="Listing Price"
                                                required
                                                helperText=""
                                                placeholder="Listing Price"
                                                value={(fields.listingPrice > 0 ? fields.listingPrice.toString() : "")}
                                                onChange={(e) => setFields({ ...fields, listingPrice: prepareNumber(Number(e.target.value))})}
                                            />
                                        </div>
                                        <div className="col-span-2 mt-8 text-white text-header-small-font-size">USD</div>
                                    </div>
                                </div>
                                <div className="form-element pt-6">
                                    <div className="flex">
                                        <label className="text-white text-xs pr-2.5">
                                        Fully Diluted Value (FDV)
                                        </label>
                                        <span className="text-white text-xs pr-2.5">{fields.supply * fields.listingPrice > 0 ? fields.supply * fields.listingPrice : "--"}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="form-element h-full">
                                    <Input
                                        textarea
                                        type="text"
                                        title="Description"
                                        required
                                        helperText=""
                                        placeholder="Describe your Community Coin and associated project and protocol."
                                        value={fields.desc}
                                        onChange={(e) => setFields({ ...fields, desc: e.target.value })}
                                    />
                                </div>
                            </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                        {!loading&&
                            <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep4}>Next</button>
                        }
                        {loading &&
                            <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">Loading...</button>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
